import { NextResponse } from "next/server";

import {
  createGenerateTraceStep,
  createPlanTraceStep,
  createVerifyTraceStep,
  createRespondTraceStep,
  createRetrieveTraceStep,
} from "@/lib/agent";
import { generateGroundedAnswer } from "@/lib/llm";
import { retrieveRelevantChunks } from "@/lib/retriever";
import { readChunks } from "@/lib/storage";
import type { AgentTraceStep, VerificationResult } from "@/lib/types";
import {
  getRefusalMessage,
  shouldRefuseAnswer,
  verifyAnswerSupport,
} from "@/lib/verifier";

export const runtime = "nodejs";

const DEFAULT_TOP_K = 5;
const MAX_TOP_K = 20;

interface AskRequestBody {
  query?: unknown;
  topK?: unknown;
}

export async function POST(request: Request) {
  const agentTrace: AgentTraceStep[] = [];

  try {
    const body = (await request.json()) as AskRequestBody;
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          message: "Query is required.",
        },
        { status: 400 },
      );
    }

    const requestedTopK =
      typeof body.topK === "number" && Number.isFinite(body.topK)
        ? Math.floor(body.topK)
        : DEFAULT_TOP_K;
    const topK = Math.min(Math.max(requestedTopK, 1), MAX_TOP_K);

    agentTrace.push(createPlanTraceStep(query, topK));

    const chunks = await readChunks();
    const totalChunksSearched = chunks.length;

    if (chunks.length === 0) {
      const verification: VerificationResult = {
        supported: false,
        confidence: "low",
        reason: "No uploaded document chunks are available for verification.",
      };

      agentTrace.push(createRetrieveTraceStep(totalChunksSearched, 0));
      agentTrace.push(createGenerateTraceStep(false, 0));
      agentTrace.push(createVerifyTraceStep(verification, true));
      agentTrace.push(createRespondTraceStep(0, false, "No chunks available.", true));

      return NextResponse.json({
        success: true,
        query,
        answer: "No uploaded document chunks are available. Please upload a PDF first.",
        evidence: [],
        verification,
        message: "No chunks available.",
        agentTrace,
      });
    }

    const evidence = await retrieveRelevantChunks(query, chunks, topK);
    agentTrace.push(createRetrieveTraceStep(totalChunksSearched, evidence.length));

    if (evidence.length === 0) {
      const verification: VerificationResult = {
        supported: false,
        confidence: "low",
        reason: "No relevant evidence was retrieved for this question.",
      };

      agentTrace.push(createGenerateTraceStep(false, 0));
      agentTrace.push(createVerifyTraceStep(verification, true));
      agentTrace.push(
        createRespondTraceStep(0, false, "No relevant evidence found.", true),
      );

      return NextResponse.json({
        success: true,
        query,
        answer:
          "The uploaded materials do not provide enough relevant evidence to answer this question.",
        evidence: [],
        verification,
        message: "No relevant evidence found.",
        agentTrace,
      });
    }

    const groundedAnswer = await generateGroundedAnswer(query, evidence);
    agentTrace.push(createGenerateTraceStep(true, evidence.length, groundedAnswer.model));

    const verification = verifyAnswerSupport(query, groundedAnswer.answer, evidence);
    const refused = shouldRefuseAnswer(verification);
    const finalAnswer = refused ? getRefusalMessage() : groundedAnswer.answer;

    agentTrace.push(createVerifyTraceStep(verification));
    agentTrace.push(
      createRespondTraceStep(
        groundedAnswer.evidence.length,
        false,
        refused
          ? "Returned refusal because evidence support was weak."
          : "Generated grounded answer from retrieved evidence.",
        refused,
      ),
    );

    return NextResponse.json({
      success: true,
      query,
      answer: finalAnswer,
      evidence: groundedAnswer.evidence,
      verification,
      model: groundedAnswer.model,
      message: refused
        ? "Returned evidence-based refusal after verification."
        : "Generated grounded answer from retrieved evidence.",
      agentTrace,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate grounded answer.";

    if (agentTrace.length > 0 && !agentTrace.some((step) => step.title === "Generate")) {
      agentTrace.push(createGenerateTraceStep(true, 0, undefined, message));
    }

    if (agentTrace.length > 0 && !agentTrace.some((step) => step.title === "Verify")) {
      agentTrace.push(
        createVerifyTraceStep(
          {
            supported: false,
            confidence: "low",
            reason: message,
          },
          false,
        ),
      );
    }

    if (agentTrace.length > 0 && !agentTrace.some((step) => step.title === "Respond")) {
      agentTrace.push(createRespondTraceStep(0, true, message, true));
    }

    return NextResponse.json(
      {
        success: false,
        message,
        agentTrace,
      },
      { status: 500 },
    );
  }
}

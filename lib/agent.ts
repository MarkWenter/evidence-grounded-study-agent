import type { AgentTraceStep } from "./types";
import type { VerificationResult } from "./types";

export function createPlanTraceStep(query: string, topK: number): AgentTraceStep {
  return {
    step: 1,
    title: "Plan",
    description: "Analyze the question and prepare an evidence-grounded workflow.",
    status: "completed",
    details: `Question length: ${query.length} characters. Retrieval topK set to ${topK}.`,
  };
}

export function createRetrieveTraceStep(
  totalChunksSearched: number,
  evidenceCount: number,
): AgentTraceStep {
  return {
    step: 2,
    title: "Retrieve",
    description: "Search local page-grounded chunks using lightweight lexical retrieval.",
    status: "completed",
    details: `Chunks searched: ${totalChunksSearched}. Evidence items retrieved: ${evidenceCount}.`,
  };
}

export function createGenerateTraceStep(
  wasCalled: boolean,
  evidenceCount: number,
  model?: string,
  errorMessage?: string,
): AgentTraceStep {
  if (!wasCalled) {
    return {
      step: 3,
      title: "Generate",
      description: "Skip grounded answer generation because no relevant evidence is available.",
      status: "skipped",
      details: `Evidence items available: ${evidenceCount}.`,
    };
  }

  if (errorMessage) {
    return {
      step: 3,
      title: "Generate",
      description: "Attempt grounded answer generation with Gemini.",
      status: "error",
      details: errorMessage,
    };
  }

  return {
    step: 3,
    title: "Generate",
    description: "Generate a grounded answer with Gemini from retrieved evidence.",
    status: "completed",
    details: `Evidence items used: ${evidenceCount}.${model ? ` Model: ${model}.` : ""}`,
  };
}

export function createVerifyTraceStep(
  verification: VerificationResult,
  wasSkipped: boolean = false,
): AgentTraceStep {
  if (wasSkipped) {
    return {
      step: 4,
      title: "Verify",
      description: "Skip full verification because generation was not executed.",
      status: "skipped",
      details: verification.reason,
    };
  }

  return {
    step: 4,
    title: "Verify",
    description: "Check whether the answer is supported by retrieved evidence.",
    status: verification.supported
      ? "completed"
      : verification.confidence === "low"
        ? "warning"
        : "error",
    details: `Supported: ${verification.supported}. Confidence: ${verification.confidence}. ${verification.reason}`,
  };
}

export function createRespondTraceStep(
  evidenceCount: number,
  hadError: boolean,
  message: string,
  refused: boolean = false,
): AgentTraceStep {
  return {
    step: 5,
    title: "Respond",
    description: "Return answer, citations, and retrieved source evidence to the UI.",
    status: hadError ? "error" : refused ? "warning" : "completed",
    details: `Evidence returned: ${evidenceCount}. ${message}`,
  };
}

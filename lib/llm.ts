import { GoogleGenAI } from "@google/genai";

import type { AnswerMode, EvidenceItem, GroundedAnswerResult } from "./types";

const GEMINI_MODEL = "gemini-2.5-flash";

function buildEvidenceBlock(evidence: EvidenceItem[]): string {
  return evidence
    .map(
      (item, index) =>
        `${index + 1}. Source: ${item.fileName}, page ${item.page}\nSnippet: ${item.textSnippet}`,
    )
    .join("\n\n");
}

function buildStudyPrompt(question: string, evidence: EvidenceItem[]): string {
  return [
    "You are a study assistant that must answer only from the provided evidence.",
    "Do not use outside knowledge.",
    "If the evidence is insufficient, say: The uploaded materials do not provide enough evidence to answer this question.",
    "Keep the answer concise and study-focused.",
    "Every factual claim must include citations in this exact format: [fileName, p. page]",
    "Each citation bracket must contain exactly one file name and one page number.",
    "If you need multiple citations, write them as separate brackets, for example: [file.pdf, p. 7] [file.pdf, p. 10]",
    "Never merge multiple page numbers into one citation bracket.",
    "Do not reveal hidden reasoning or chain-of-thought.",
    "",
    `Question: ${question}`,
    "",
    "Evidence:",
    buildEvidenceBlock(evidence),
  ].join("\n");
}

function buildAssessmentSafePrompt(question: string, evidence: EvidenceItem[]): string {
  return [
    "You are a study assistant running in Assessment-safe Hint Mode.",
    "Use only the provided evidence. Do not use outside knowledge.",
    "Do not provide a direct final answer or final solution.",
    "Provide hints, guiding questions, prerequisite concepts, and what to review next.",
    "State clearly that this is an assessment-safe hint response.",
    "If evidence is insufficient, say: The uploaded materials do not provide enough evidence to answer this question.",
    "Every factual claim must include citations in this exact format: [fileName, p. page]",
    "Each citation bracket must contain exactly one file name and one page number.",
    "If you need multiple citations, write them as separate brackets, for example: [file.pdf, p. 7] [file.pdf, p. 10]",
    "Never merge multiple page numbers into one citation bracket.",
    "Do not reveal hidden reasoning or chain-of-thought.",
    "Use this output structure:",
    "Assessment-safe Hint Response",
    "",
    "Relevant sources:",
    "- [fileName, p. page]",
    "",
    "Hints:",
    "1. ...",
    "2. ...",
    "",
    "Guiding questions:",
    "1. ...",
    "2. ...",
    "",
    "Prerequisite concepts to review:",
    "- ...",
    "",
    "What to do next:",
    "- ...",
    "",
    `Question: ${question}`,
    "",
    "Evidence:",
    buildEvidenceBlock(evidence),
  ].join("\n");
}

function buildPrompt(question: string, evidence: EvidenceItem[], mode: AnswerMode): string {
  if (mode === "assessment_safe") {
    return buildAssessmentSafePrompt(question, evidence);
  }

  return buildStudyPrompt(question, evidence);
}

export async function generateGroundedAnswer(
  question: string,
  evidence: EvidenceItem[],
  mode: AnswerMode = "study",
): Promise<GroundedAnswerResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to .env.local and restart the dev server.",
    );
  }

  if (evidence.length === 0) {
    return {
      answer:
        "The uploaded materials do not provide enough relevant evidence to answer this question.",
      evidence,
      model: GEMINI_MODEL,
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildPrompt(question, evidence, mode),
  });

  const answer = response.text?.trim();
  if (!answer) {
    throw new Error("Gemini returned an empty answer.");
  }

  return {
    answer,
    evidence,
    model: GEMINI_MODEL,
  };
}

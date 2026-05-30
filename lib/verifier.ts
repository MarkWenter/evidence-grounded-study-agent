import type { EvidenceItem, VerificationResult } from "./types";

const EVIDENCE_INSUFFICIENT_MESSAGE =
  "The uploaded materials do not provide enough reliable evidence to answer this question. Please upload more relevant course materials or rephrase the question.";

function containsEvidenceInsufficientStatement(answer: string): boolean {
  const normalized = answer.toLowerCase();
  return (
    normalized.includes("do not provide enough") ||
    normalized.includes("not provide enough") ||
    normalized.includes("insufficient evidence")
  );
}

function extractCitations(answer: string): string[] {
  return answer.match(/\[[^\]]+,\s*p\.\s*\d+\]/gi) ?? [];
}

function averageEvidenceScore(evidence: EvidenceItem[]): number {
  const scores = evidence
    .map((item) => item.score)
    .filter((score): score is number => typeof score === "number");

  if (scores.length === 0) {
    return 0;
  }

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function verifyAnswerSupport(
  _query: string,
  answer: string,
  evidence: EvidenceItem[],
): VerificationResult {
  if (evidence.length === 0) {
    return {
      supported: false,
      confidence: "low",
      reason: "No retrieved evidence is available.",
    };
  }

  if (!answer.trim()) {
    return {
      supported: false,
      confidence: "low",
      reason: "No answer was generated.",
    };
  }

  if (containsEvidenceInsufficientStatement(answer)) {
    return {
      supported: false,
      confidence: "low",
      reason: "The system could not find enough evidence.",
    };
  }

  const citations = extractCitations(answer);
  if (citations.length === 0) {
    return {
      supported: false,
      confidence: "low",
      reason: "The answer does not include page-grounded citations.",
    };
  }

  const avgScore = averageEvidenceScore(evidence);
  if (avgScore < 1.5) {
    return {
      supported: false,
      confidence: "low",
      reason: "Retrieved evidence is weak based on low retrieval scores.",
    };
  }

  if (evidence.length === 1) {
    return {
      supported: true,
      confidence: "medium",
      reason: "One cited evidence item supports the answer.",
    };
  }

  if (avgScore >= 3) {
    return {
      supported: true,
      confidence: "high",
      reason: "Multiple cited evidence items with strong retrieval scores support the answer.",
    };
  }

  return {
    supported: true,
    confidence: "medium",
    reason: "Multiple cited evidence items support the answer.",
  };
}

export function shouldRefuseAnswer(verification: VerificationResult): boolean {
  return !verification.supported || verification.confidence === "low";
}

export function getRefusalMessage(): string {
  return EVIDENCE_INSUFFICIENT_MESSAGE;
}

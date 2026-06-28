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
  const evidenceCount = evidence.length;
  const avgScore = averageEvidenceScore(evidence);
  const citations = extractCitations(answer);
  const citationPresent = citations.length > 0;

  if (evidence.length === 0) {
    return {
      supported: false,
      confidence: "low",
      reason: "No retrieved evidence is available, so the answer cannot be supported.",
      evidenceCount,
      averageEvidenceScore: avgScore,
      citationPresent,
      ruleApplied: "no_evidence",
    };
  }

  if (!answer.trim()) {
    return {
      supported: false,
      confidence: "low",
      reason: "No answer text was generated, so support cannot be established.",
      evidenceCount,
      averageEvidenceScore: avgScore,
      citationPresent,
      ruleApplied: "empty_answer",
    };
  }

  if (containsEvidenceInsufficientStatement(answer)) {
    return {
      supported: false,
      confidence: "low",
      reason: "The answer itself indicates evidence is insufficient.",
      evidenceCount,
      averageEvidenceScore: avgScore,
      citationPresent,
      ruleApplied: "answer_states_insufficient_evidence",
    };
  }

  if (citations.length === 0) {
    return {
      supported: false,
      confidence: "low",
      reason: "The answer does not include page-grounded citations in [file, p. n] format.",
      evidenceCount,
      averageEvidenceScore: avgScore,
      citationPresent,
      ruleApplied: "missing_citation",
    };
  }

  if (avgScore < 1.5) {
    return {
      supported: false,
      confidence: "low",
      reason:
        "Retrieved evidence exists, but average retrieval score is below the support threshold.",
      evidenceCount,
      averageEvidenceScore: avgScore,
      citationPresent,
      ruleApplied: "low_average_retrieval_score",
    };
  }

  if (evidence.length === 1) {
    return {
      supported: true,
      confidence: "medium",
      reason: "One cited evidence item supports the answer, so confidence is medium.",
      evidenceCount,
      averageEvidenceScore: avgScore,
      citationPresent,
      ruleApplied: "single_evidence_with_citation",
    };
  }

  if (avgScore >= 3) {
    return {
      supported: true,
      confidence: "high",
      reason:
        "Multiple cited evidence items and strong average retrieval score support a high-confidence decision.",
      evidenceCount,
      averageEvidenceScore: avgScore,
      citationPresent,
      ruleApplied: "multiple_evidence_with_strong_scores",
    };
  }

  return {
    supported: true,
    confidence: "medium",
    reason: "Multiple cited evidence items support the answer, with moderate score strength.",
    evidenceCount,
    averageEvidenceScore: avgScore,
    citationPresent,
    ruleApplied: "multiple_evidence_with_citation",
  };
}

export function shouldRefuseAnswer(verification: VerificationResult): boolean {
  return !verification.supported || verification.confidence === "low";
}

export function getRefusalMessage(): string {
  return EVIDENCE_INSUFFICIENT_MESSAGE;
}

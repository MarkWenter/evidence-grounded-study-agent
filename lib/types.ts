export interface DocumentRecord {
  id: string;
  fileName: string;
  uploadedAt: string;
}

export interface ChunkRecord {
  id: string;
  documentId: string;
  fileName: string;
  page: number;
  text: string;
}

export interface EvidenceItem {
  chunkId: string;
  fileName: string;
  page: number;
  textSnippet: string;
  score?: number;
}

export interface AgentTraceStep {
  step: number;
  title: string;
  description: string;
  status?: "completed" | "skipped" | "warning" | "error";
  details?: string;
}

export type ConfidenceLevel = "high" | "medium" | "low";

export interface VerificationResult {
  supported: boolean;
  confidence: ConfidenceLevel;
  reason: string;
}

export interface AnswerResult {
  answer: string;
  evidence: EvidenceItem[];
  agentTrace?: AgentTraceStep[];
  model?: string;
  message?: string;
  verification?: VerificationResult;
  finalAnswer?: string;
}

export interface RetrievalResult {
  query: string;
  evidence: EvidenceItem[];
  totalChunksSearched: number;
}

export interface GroundedAnswerResult {
  answer: string;
  evidence: EvidenceItem[];
  model?: string;
}

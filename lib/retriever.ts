import type { ChunkRecord, EvidenceItem } from "./types";

const DEFAULT_TOP_K = 5;
const MAX_SNIPPET_CHARS = 360;

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "what",
  "when",
  "where",
  "which",
  "with",
]);

function normalize(text: string): string {
  return text.toLowerCase();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .match(/[a-z0-9]+/g)
    ?.filter((token) => !STOPWORDS.has(token)) ?? [];
}

function countTokens(tokens: string[]): Map<string, number> {
  return tokens.reduce((acc, token) => {
    acc.set(token, (acc.get(token) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());
}

function createSnippet(text: string, queryTerms: string[]): string {
  const cleanText = text.replace(/\s+/g, " ").trim();
  if (cleanText.length <= MAX_SNIPPET_CHARS) {
    return cleanText;
  }

  const lower = cleanText.toLowerCase();
  const firstMatchIndex = queryTerms
    .map((term) => lower.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (firstMatchIndex === undefined) {
    return `${cleanText.slice(0, MAX_SNIPPET_CHARS)}...`;
  }

  const half = Math.floor(MAX_SNIPPET_CHARS / 2);
  const start = Math.max(0, firstMatchIndex - half);
  const end = Math.min(cleanText.length, start + MAX_SNIPPET_CHARS);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < cleanText.length ? "..." : "";

  return `${prefix}${cleanText.slice(start, end)}${suffix}`;
}

function scoreChunk(queryTerms: string[], chunkText: string, query: string): number {
  if (!chunkText.trim()) {
    return 0;
  }

  const chunkTokens = tokenize(chunkText);
  const frequencies = countTokens(chunkTokens);
  let score = 0;

  for (const term of queryTerms) {
    score += frequencies.get(term) ?? 0;
  }

  if (query.trim().length > 2 && normalize(chunkText).includes(normalize(query))) {
    score += 2;
  }

  return score;
}

export async function retrieveRelevantChunks(
  question: string,
  chunks: ChunkRecord[],
  topK: number = DEFAULT_TOP_K,
): Promise<EvidenceItem[]> {
  const queryTerms = tokenize(question);
  if (queryTerms.length === 0 || chunks.length === 0) {
    return [];
  }

  const ranked = chunks
    .map((chunk) => {
      const score = scoreChunk(queryTerms, chunk.text, question);
      return {
        chunk,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (a.chunk.fileName !== b.chunk.fileName) {
        return a.chunk.fileName.localeCompare(b.chunk.fileName);
      }

      return a.chunk.page - b.chunk.page;
    })
    .slice(0, topK);

  return ranked.map(({ chunk, score }) => ({
    chunkId: chunk.id,
    fileName: chunk.fileName,
    page: chunk.page,
    textSnippet: createSnippet(chunk.text, queryTerms),
    score,
  }));
}

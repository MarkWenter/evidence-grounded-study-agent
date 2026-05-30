# WORK_REPORT-3

## 1. Objective and Conclusion

Objective:
Complete Step 3 for the Evidence-Grounded Study Agent by implementing lightweight local retrieval over persisted chunks and showing retrieved evidence in the UI.

Conclusion:
Step 3 is completed. The project now supports question-driven retrieval from local chunk data, returns ranked evidence with source metadata, and displays evidence results in the homepage UI.

## 2. Files Added, Modified, or Deleted

Added:
- app/api/retrieve/route.ts
- prompt-Report/WORK_REPORT-3.md

Modified:
- lib/types.ts
- lib/retriever.ts
- components/QuestionPanel.tsx
- components/EvidenceList.tsx
- app/page.tsx
- README.md

Deleted:
- None

## 3. Retrieval API Route Description

Route:
- app/api/retrieve/route.ts

Method:
- POST

Request JSON:
- query: string (required)
- topK: number (optional, clamped to safe range)

Behavior:
1. Validates query is present and non-empty.
2. Reads all chunks from local JSON storage via lib/storage.ts.
3. Calls retrieveRelevantChunks(query, chunks, topK).
4. Returns structured JSON with:
   - success
   - query
   - evidence
   - totalChunksSearched
   - message
5. If no chunks exist, returns success true with empty evidence and message:
   - No chunks available. Upload a PDF first.
6. On errors, returns success false with clear message and no stack trace.

## 4. Retrieval Scoring Behavior

Implemented in:
- lib/retriever.ts

Approach:
- Deterministic keyword retrieval without external services.
- Lowercase normalization and alphanumeric tokenization.
- Basic stopword filtering.
- Chunk score based on query-term frequency overlap.
- Small bonus if full query phrase appears in chunk text.
- Sorted by score descending, then file/page for deterministic tie-breaking.
- Returns topK evidence items with score > 0.
- If no match, returns empty evidence list.

## 5. Evidence Snippet Behavior

Implemented in:
- lib/retriever.ts

Behavior:
- Snippet is derived from chunk text.
- If a query term is found, snippet centers around first matched term.
- Otherwise uses leading text segment.
- Snippet length is capped for readability.

Metadata preserved per evidence item:
- chunkId
- fileName
- page
- textSnippet
- score

## 6. UI Changes

Updated:
- components/QuestionPanel.tsx
- components/EvidenceList.tsx
- app/page.tsx

QuestionPanel changes:
- Added active question input.
- Added Retrieve Evidence submit action to /api/retrieve.
- Added status/message states: idle, loading, success, error.
- Sends retrieval results to parent via callback.

EvidenceList changes:
- Displays dynamic evidence from retrieval results.
- Shows file name, page number, score, and snippet.
- Shows neutral placeholder before first retrieval.
- Shows explicit no-result message when retrieval has zero matches.

Homepage changes:
- Stores retrieval state.
- Passes retrieval callback to QuestionPanel.
- Passes evidence state to EvidenceList.
- Keeps UploadPanel and uploaded document list behavior from Step 2.
- Keeps AgentTrace and AnswerCard as placeholders.

## 7. Self-Check Results

Executed checks:
1. npm run lint
   - Result: Passed.
2. npm run dev
   - Result: Started successfully (localhost:3000 ready).
3. Manual upload test with user-provided PDF:
   - File: I:\703\study-agent\test\Week8.1_Compound_AI_Systems.pdf
   - Upload API response: success true, chunkCount 65.
4. Retrieval API test with relevant query:
   - Query: What is a Compound AI System?
   - Result: success true, non-empty evidence, totalChunksSearched 65.
5. Retrieval API test with unrelated query:
   - Query: quantum banana galaxy
   - Result: success true, empty evidence, message indicates no relevant evidence.
6. UI retrieval display test in browser:
   - Relevant query showed evidence list with file name, page, score, and snippet.
   - Unrelated query showed no-relevant-evidence message.
7. Step 2 behavior preservation:
   - /api/documents still returns uploaded documents with chunkCount.

Test artifact note:
- Data files were reset to empty arrays after verification to keep repository state clean.

## 8. Risks and Follow-Up Suggestions

Current risks:
- Retrieval is lexical and may miss semantically similar phrasing.
- Tokenization and stopword list are intentionally lightweight and English-focused.

Follow-up suggestions:
- Step 4: grounded answer generation with citations using retrieved evidence.
- Add retrieval unit tests for deterministic scoring and snippet behavior.
- Improve token handling for punctuation-heavy slide text in later steps.

## 9. Scope Boundary Statement

Not implemented in Step 3:
- LLM answer generation
- Embeddings
- Vector search or vector database
- Agent orchestration logic
- Verifier logic
- Confidence scoring and refusal behavior
- Evaluation logic

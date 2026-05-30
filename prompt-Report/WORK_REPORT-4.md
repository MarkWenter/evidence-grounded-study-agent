# WORK_REPORT-4

## 1. Objective and Conclusion

Objective:
Complete Step 4 by implementing Gemini-based grounded answer generation from retrieved evidence, keeping the API key server-side, and displaying answers with citations in the UI.

Conclusion:
Step 4 is completed. The project now supports server-side Gemini answer generation from retrieved evidence, returns grounded answers with citations, and displays both the answer and source evidence in the homepage UI.

## 2. Files Added, Modified, or Deleted

Added:
- app/api/ask/route.ts
- .env.example
- prompt-Report/WORK_REPORT-4.md

Modified:
- package.json
- package-lock.json
- lib/types.ts
- lib/llm.ts
- components/QuestionPanel.tsx
- components/AnswerCard.tsx
- components/EvidenceList.tsx
- app/page.tsx
- README.md

Deleted:
- None

## 3. Dependencies Added and Justification

Added dependency:
- @google/genai

Justification:
- Official Google Gemini SDK for server-side grounded answer generation.
- Keeps API access in server routes only.
- Avoids introducing extra orchestration or framework dependencies.

## 4. Environment Variable Setup

Environment variable used:
- GEMINI_API_KEY

Local setup:
1. Create .env.local in the project root.
2. Add:
   GEMINI_API_KEY=【api】
3. Restart the development server.

Repository support:
- Added .env.example with placeholder value only.
- No real API key was added to the repository.
- Existing .gitignore already ignored local env files.

## 5. Answer API Route Description

Route:
- app/api/ask/route.ts

Method:
- POST

Request body:
- query: string
- topK: number optional

Behavior:
1. Validates the query.
2. Reads chunks from local JSON storage.
3. Runs retrieval over chunks.
4. If no chunks exist, returns success true with a clear upload-first message.
5. If no relevant evidence exists, returns success true with a clear evidence-insufficient answer.
6. If evidence exists, calls generateGroundedAnswer.
7. Returns:
   - success
   - query
   - answer
   - evidence
   - model
   - message
8. On missing GEMINI_API_KEY, returns success false with a clear configuration message.
9. On other errors, returns success false with a clear message and no stack trace.

## 6. Gemini Grounded Answer Generation Behavior

Implemented in:
- lib/llm.ts

Behavior:
- Reads GEMINI_API_KEY from process.env.GEMINI_API_KEY.
- Uses gemini-2.5-flash.
- Constructs a strict prompt that:
  - allows answering only from provided evidence
  - forbids outside knowledge
  - instructs the model to return a study-focused answer
  - instructs the model to state when evidence is insufficient
  - forbids hidden reasoning output
- Sends only retrieved evidence snippets and metadata to Gemini.
- Returns answer text and model name.

## 7. Citation Behavior

Citation requirements implemented through prompt control:
- Citation format requested: [fileName, p. page]
- Each citation bracket must contain exactly one file name and one page number.
- Multiple citations are emitted as separate brackets.

Validated API output example behavior:
- [Week8.1_Compound_AI_Systems.pdf, p. 7]
- [Week8.1_Compound_AI_Systems.pdf, p. 10]

## 8. UI Changes

Updated:
- components/QuestionPanel.tsx
- components/AnswerCard.tsx
- components/EvidenceList.tsx
- app/page.tsx

QuestionPanel:
- Primary action now calls /api/ask.
- Shows idle, loading, success, and error states.
- Passes answer, evidence, message, and model back to parent state.

AnswerCard:
- Shows grounded answer.
- Shows model name when available.
- Shows neutral placeholder before first question.
- Shows controlled error message if answer generation fails, including missing-key errors.

EvidenceList:
- Still shows retrieved source evidence.
- Displays file name, page number, score, and snippet.

Homepage:
- Maintains answer state and evidence state together.
- Preserves upload and document list behavior.
- Keeps AgentTrace as Step 5 placeholder.

## 9. Self-Check Results

Executed checks:
1. npm run lint
   - Result: Passed.
2. npm run dev
   - Result: Started successfully.
3. Upload API verification
   - Result: Passed using I:\703\study-agent\test\Week8.1_Compound_AI_Systems.pdf.
4. Retrieval API verification
   - Result: Passed after Step 4 changes.
5. Ask API verification
   - Result: Passed in current local environment.
   - Returned grounded answer, evidence list, and model name.
6. Citation verification
   - After tightening prompt instructions, API response used separate citations in the required bracket format.
7. Browser UI verification
   - Result: Passed.
   - AnswerCard showed grounded answer with citations.
   - EvidenceList showed file name, page number, score, and snippet.
8. Missing GEMINI_API_KEY verification
   - Practical isolated route execution was attempted, but a second Next dev server was blocked by Next's single-project dev-server restriction while the main local server was already running.
   - The missing-key branch in lib/llm.ts and app/api/ask/route.ts was inspected and confirmed to return a controlled error message.
9. Retrieval preservation
   - app/api/retrieve/route.ts remained functional.

Test artifact note:
- Local JSON data files were reset to empty arrays after verification to keep repository state clean.

## 10. Risks and Follow-Up Suggestions

Current risks:
- Citation format relies on prompt adherence by the model.
- OCR-free PDF extraction still limits scanned-document quality.
- Retrieval remains lexical and may miss semantically related evidence.

Follow-up suggestions:
- Step 5: implement agent trace logging and display.
- Add integration tests for /api/ask and citation formatting.
- Consider light post-processing validation for citation format in later steps.

## 11. Scope Boundary Statement

The following have not been implemented in Step 4:
- agent orchestration
- real agent trace logic
- verifier logic
- confidence scoring
- refusal behavior
- embeddings
- vector search or vector database
- evaluation logic

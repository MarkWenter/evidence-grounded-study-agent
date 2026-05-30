# WORK_REPORT-2

## 1. Objective and Conclusion

Objective:
Implement Step 2 of the Evidence-Grounded Study Agent:
- PDF upload
- Page-level text extraction
- Page-grounded chunk creation
- Local JSON persistence
- Homepage document list refresh

Conclusion:
Step 2 is completed. The project now supports uploading a PDF through the homepage, parsing text per page, saving DocumentRecord and ChunkRecord data into local JSON files under data/, and showing uploaded documents with chunk counts in the UI.

## 2. Files Added, Modified, or Deleted

Added:
- app/api/upload/route.ts
- app/api/documents/route.ts
- prompt-Report/WORK_REPORT-2.md

Modified:
- components/UploadPanel.tsx
- app/page.tsx
- lib/storage.ts
- lib/pdfParser.ts
- lib/chunker.ts
- README.md
- package.json
- package-lock.json
- data/documents.json
- data/chunks.json

Deleted:
- None

## 3. Dependencies Added and Justification

Added dependency:
- pdf-parse

Justification:
- Needed to implement real PDF text extraction in Node.js server routes.
- Supports page-level extraction through parser APIs without introducing retrieval, embeddings, LLM, or verifier logic.

Dependency note:
- The direct pdfjs-dist dependency was removed after integration because pdf-parse already handles PDF.js usage internally for this step.

## 4. PDF Upload Route Description

Route:
- app/api/upload/route.ts

Behavior:
1. Accepts multipart/form-data with field name file.
2. Validates:
   - file exists
   - file name exists
   - file type/name indicates PDF
3. Parses uploaded PDF into page-grounded chunks.
4. Appends document record to data/documents.json.
5. Appends chunk records to data/chunks.json.
6. Returns structured JSON:
   - success: true/false
   - document
   - chunkCount
   - message

Error handling:
- Returns clear error messages without stack traces in API response bodies.

## 5. PDF Parsing and Chunking Behavior

Implemented in:
- lib/pdfParser.ts
- lib/chunker.ts

Behavior:
- One page equals one chunk.
- Metadata preserved per chunk:
  - id
  - documentId
  - fileName
  - page
  - text
- Document metadata preserved:
  - id
  - fileName
  - uploadedAt
- If a page has no extractable text, a placeholder text is used:
  - [No extractable text on this page]

No OCR, image parsing, semantic chunking, retrieval, or embeddings are implemented.

## 6. Local JSON Storage Behavior

Implemented in:
- lib/storage.ts

Storage files:
- data/documents.json
- data/chunks.json

Implemented functions:
- readDocuments
- writeDocuments
- appendDocument
- readChunks
- writeChunks
- appendChunks
- clearAllData

Behavior:
- Ensures data directory/files exist.
- Initializes missing files with empty arrays.
- Reads and validates JSON array structure.
- Throws clear errors for invalid JSON content.
- Server-side only usage through API routes.

## 7. UI Changes

Updated:
- components/UploadPanel.tsx
- app/page.tsx

Changes:
- UploadPanel is now functional:
  - file selection
  - upload to /api/upload
  - status display: idle, uploading, success, error
  - success details: file name and extracted chunk count
- Homepage now displays uploaded documents with:
  - file name
  - uploaded time
  - chunk count
- Document list refreshes after successful upload.

## 8. Self-Check Results

Executed checks:
1. npm run lint
   - Result: Passed.
2. npm run dev
   - Result: Started successfully.
   - Ready output observed on localhost:3000.
3. Upload endpoint existence
   - Verified: POST /api/upload responded successfully for a sample PDF.
4. Documents endpoint existence
   - Verified: GET /api/documents returned document list with chunkCount.
5. Local JSON persistence
   - Verified during manual API test: data/documents.json and data/chunks.json were updated with records.
6. UI visibility
   - Verified in browser snapshot: Uploaded Documents section showed uploaded sample records.
7. Data cleanup after verification
   - data/documents.json and data/chunks.json were reset to empty arrays to keep repository state clean.

## 9. Risks and Follow-Up Suggestions

Current risks:
- Text extraction quality varies by PDF structure (scanned/image PDFs may produce empty text).
- Placeholder empty-page text may require better UX messaging in future steps.

Follow-up suggestions:
- Step 3: retrieval over persisted chunk records.
- Add lightweight integration tests for upload and persistence routes.
- Add file size limits and upload validation hardening in later steps.

## 10. Scope Boundary Statement

The following are not implemented in Step 2:
- retrieval logic
- embeddings
- vector database
- LLM API calls
- agent orchestration logic
- verifier logic
- evaluation logic

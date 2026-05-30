# WORK_REPORT-7

## 1. Objective and Conclusion

Objective:
Complete Step 7 by creating a lightweight evaluation framework and documentation that tests retrieval, citation grounding, verification output, and refusal behavior without introducing heavy infrastructure.

Conclusion:
Step 7 is completed. A small repeatable evaluation question set and evaluation documentation are now added under evaluation/. Mandatory self-checks were executed, including lint, app run attempt, and two required question evaluations (supported and unsupported) through /api/ask.

## 2. Files Added, Modified, or Deleted

Added:
- evaluation/eval_questions.json
- evaluation/eval_results.md
- evaluation/eval_checklist.md
- prompt-Report/WORK_REPORT-7.md

Modified:
- README.md

Deleted:
- None

## 3. Evaluation Question Set Description

File:
- evaluation/eval_questions.json

Question set size:
- 5 questions

Coverage:
- Q1 definition question: Compound AI System
- Q2 agentic AI capability question
- Q3 trustworthiness problems question
- Q4 retrieval or memory support question
- Q5 unsupported refusal question: final exam date

Per-question fields included:
- id
- question
- expectedBehavior
- expectedSourceHint
- evaluationFocus

Design notes:
- Expected behavior is intent-based instead of exact answer text to allow normal Gemini variability.

## 4. Evaluation Criteria

Defined in evaluation/eval_results.md:
- Retrieval relevance
- Citation presence
- Answer grounding consistency
- Verification behavior (supported/confidence/reason)
- Refusal behavior for unsupported questions

## 5. Evaluation Result Documentation Behavior

File:
- evaluation/eval_results.md

Implemented behavior:
- Includes evaluation purpose, setup, uploaded documents, criteria, results table, and limitations.
- Uses concise observed summaries rather than large raw model outputs.
- Marks Q2 to Q4 as pending manual run when relevant documents are not guaranteed in this session.
- Explicitly notes that live Gemini outputs may vary slightly.

Observed runs recorded:
- Q1: Pass (relevant retrieval, citations present, verification supported=true confidence=high)
- Q5: Pass (unsupported path, low-confidence behavior, no relevant evidence)

## 6. Manual Evaluation Instructions

File:
- evaluation/eval_checklist.md

Included instructions:
1. Start app with npm run dev
2. Ensure .env.local contains GEMINI_API_KEY=【api】
3. Upload required PDFs
4. Ask all questions from evaluation/eval_questions.json
5. Record retrieval file/page, citation presence, verification fields, and expected behavior match
6. Validate refusal behavior on unsupported question
7. Update evaluation/eval_results.md

## 7. Self-Check Results

Checks executed:
1. npm run lint
   - Result: Passed.
2. npm run dev
   - Result: Attempted from workspace root context first and failed with ENOENT on I:\703\package.json.
   - Retried from project path; command detected an already running next dev process at localhost:3000 and exited with guidance.
   - Conclusion: app server was already running and usable at localhost:3000.
3. Upload check
   - Endpoint: /api/upload
   - Result: Passed using test/Week8.1_Compound_AI_Systems.pdf.
4. Supported question check (required)
   - Question: What is a Compound AI System?
   - Endpoint: /api/ask
   - Result: success=true with answer, evidence, verification, and agentTrace.
   - Verification observed: supported=true, confidence=high.
   - Citation observed: present in answer.
5. Unsupported question check (required)
   - Question: What is the final exam date for this course?
   - Endpoint: /api/ask
   - Result: success=true with no evidence and unsupported low-confidence verification.
   - Verification observed: supported=false, confidence=low.
   - Behavior observed: refusal-style no-evidence response.
6. Evaluation files presence
   - evaluation/eval_questions.json exists and readable.
   - evaluation/eval_results.md exists and readable.
   - evaluation/eval_checklist.md exists and readable.

Scope compliance checks:
- No embeddings/vector DB changes were introduced.
- No OCR or multimodal input changes were introduced.
- No API key exposure or hardcoding introduced.
- Existing ask/retrieve/upload architecture and run mode preserved.

## 8. Risks and Follow-Up Suggestions

Current risks:
- Q2 to Q4 outcomes depend on whether corresponding lecture materials are uploaded.
- LLM output wording can vary across runs.
- Evaluation is intentionally lightweight and mostly manual.

Follow-up suggestions:
- Run full manual pass for Q2 to Q4 after uploading all relevant lecture PDFs.
- Add a small script in future to automate result table prefill using /api/ask responses while keeping dependencies minimal.
- Keep final report aligned with this Step 7 evidence table.

## 9. Not Implemented Yet Statement

The following remain not implemented in this step:
- Final demo script and final documentation cleanup (Step 8 scope)
- Embeddings, vector search, or vector database
- OCR or multimodal input

Environment documentation remains placeholder-only:
- GEMINI_API_KEY=【api】

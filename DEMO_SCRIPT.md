# Demo Script (3 to 5 Minutes)

## 1. Demo Goal

Show that the Evidence-Grounded Study Agent can answer from uploaded course materials with page-grounded evidence, verification, confidence, and refusal behavior.

## 2. Required Setup

- .env.local configured with GEMINI_API_KEY=【api】
- App running with npm run dev
- Browser open at http://localhost:3000

## 3. Files to Upload

- test/Week8.1_Compound_AI_Systems.pdf

## 4. Demo Sequence

### Demo 1: Upload PDF

1. Open the Upload lecture PDF section.
2. Upload Week8.1_Compound_AI_Systems.pdf.
3. Show Uploaded Documents list and chunk count.

Expected point:
- The system parsed pages and stored page-grounded chunks.

### Demo 2: Ask Supported Question

Question:
- What is a Compound AI System?

Show on screen:
- Answer text
- File and page citations
- Evidence list with file, page, snippet, score
- Verification output (supported/confidence/reason)
- Agent trace with Plan, Retrieve, Generate, Verify, Respond

Expected point:
- Evidence is relevant and answer is grounded to uploaded material.

### Demo 3: Ask Unsupported Question

Question:
- What is the final exam date for this course?

Show on screen:
- Low-confidence or unsupported verification
- Refusal or evidence-insufficient answer behavior
- Agent trace showing skipped or warning path

Expected point:
- The system avoids overconfident unsupported responses.

### Demo 4: Show Evaluation Evidence

1. Open evaluation/eval_results.md.
2. Explain that evaluation checks retrieval, citation, grounding, verification, and refusal.

Expected point:
- The MVP has repeatable evaluation documentation.

## 5. Short Spoken Script

"This prototype is an evidence-grounded study assistant for course PDFs. I upload lecture material, ask a question, and the system retrieves relevant pages before generating an answer. Each answer is tied to file and page citations, and the UI shows retrieved evidence and a transparent 5-step agent trace: Plan, Retrieve, Generate, Verify, and Respond. The verifier adds supported and confidence signals, and the system refuses when evidence is weak. We also prepared a lightweight evaluation set and results document to demonstrate retrieval quality, citation grounding, and refusal behavior."

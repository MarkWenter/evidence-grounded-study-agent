# Step 7 Evaluation Results

## 1. Evaluation Purpose

This document provides a lightweight, repeatable evaluation summary for the Evidence-Grounded Study Agent MVP. The goal is to evaluate retrieval relevance, citation grounding, verification output, and refusal behavior using a small question set.

Note: live Gemini outputs may vary slightly across runs.

## 2. Test Setup

- Runtime: Next.js local development server
- Command: npm run dev
- Environment: GEMINI_API_KEY=【api】 in .env.local
- Question set: evaluation/eval_questions.json
- API used for execution checks: /api/ask and /api/retrieve

## 3. Uploaded Test Documents

- Week8.1_Compound_AI_Systems.pdf

## 4. Evaluation Criteria

- Retrieval relevance: whether returned evidence matches the question intent
- Citation presence: whether answer includes file and page citations (for supported questions)
- Answer grounding: whether answer is consistent with retrieved evidence snippets
- Verification behavior: whether response includes verification.supported, verification.confidence, verification.reason
- Refusal behavior: whether unsupported questions return low-confidence unsupported behavior or refusal-style output

## 5. Results Table

| ID | Question | Expected Behavior | Observed Behavior | Retrieval Relevant | Citation Present | Verification Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|---|
| Q1 | What is a Compound AI System? | Retrieve Week8.1 pages and answer with page citations | Retrieved Week8.1 evidence and produced cited definition answer | Yes | Yes | supported=true, confidence=high | Pass | Observed via /api/ask with Week8.1 upload |
| Q2 | What capabilities make an AI system agentic? | Retrieve agentic capabilities evidence and answer with citations | Pending manual run | Pending | Pending | Pending | Pending | Depends on whether matching lecture PDF is uploaded |
| Q3 | What are common trustworthiness problems in AI? | Retrieve trustworthiness evidence and answer with citations | Pending manual run | Pending | Pending | Pending | Pending | Depends on available trustworthiness material |
| Q4 | How does retrieval support an AI agent? | Retrieve retrieval or memory evidence and answer with citations | Pending manual run | Pending | Pending | Pending | Pending | Depends on available retrieval-focused material |
| Q5 | What is the final exam date for this course? | Return low-confidence unsupported behavior or refusal-style answer | Returned low-confidence unsupported behavior due to missing relevant evidence | No | No | supported=false, confidence=low | Pass | /api/ask returned no evidence and warning respond status |

## 6. Limitations

- Results are content-dependent: if relevant PDFs are not uploaded, some questions may correctly produce unsupported outcomes.
- LLM wording can vary across runs while still being acceptable.
- This is a lightweight MVP evaluation and does not include heavy automated benchmarking.

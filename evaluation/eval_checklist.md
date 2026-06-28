# Manual Evaluation Checklist

Use this checklist before demo or final report submission.

## A. Setup Checklist

1. Install dependencies with npm install.
2. Configure .env.local with GEMINI_API_KEY=【api】.
3. Start the app with npm run dev.
4. Upload relevant course PDFs required by evaluation questions.

## B. Functional Checklist

1. PDF upload works successfully.
2. Uploaded documents appear in the document list.
3. Retrieval returns evidence for relevant questions.
4. Ask endpoint returns an answer for supported questions.
5. Answer includes at least one file and page citation when evidence is available.
6. Evidence list displays file name and page number.
7. Agent Trace shows Plan, Retrieve, Generate, Verify, Respond.
8. Verifier returns supported, confidence, and reason fields.
9. Unsupported question triggers refusal-style or low-confidence unsupported behavior.
10. Study Mode returns direct evidence-grounded explanation behavior.
11. Assessment-safe Hint Mode returns hints and guiding questions without a direct final answer.

## C. Evaluation Checklist

1. Run all questions in evaluation/eval_questions.json manually.
2. Record top retrieved evidence for each question.
3. Record whether citations are correct.
4. Record whether answer is grounded in retrieved evidence.
5. Record verifier result and confidence appropriateness.
6. Record refusal correctness for unsupported or adversarial questions.
7. Record mode behavior correctness for Study Mode and Assessment-safe Hint Mode.
8. Update evaluation/eval_results.md with completed and not-yet-run status honestly.

## D. Report Checklist

1. Include the evaluation result table in final report materials.
2. Discuss limitations honestly.
3. Explain why unsupported refusal behavior is a safety strength.
4. Mention lexical retrieval limitations for paraphrased queries.
5. Mention future work: hybrid retrieval, GraphRAG, claim-level citation checks, and user study.

# Manual Evaluation Checklist

Use this checklist to run the Step 7 lightweight evaluation.

## 1. Start the App

1. Run npm run dev.
2. Confirm the app is reachable at http://localhost:3000.

## 2. Environment

1. Ensure .env.local includes:

GEMINI_API_KEY=【api】

2. Restart dev server after environment changes.

## 3. Upload Required Documents

1. Upload the required course PDFs from the homepage.
2. Confirm documents appear in Uploaded Documents with chunk counts.

## 4. Run Questions

1. Open evaluation/eval_questions.json.
2. Ask each question using the Ask panel.

## 5. Record for Each Question

1. Top retrieved evidence file and page.
2. Whether citation appears in answer text.
3. verification.supported value.
4. verification.confidence value.
5. verification.reason text.
6. Whether response behavior matches expectedBehavior.

## 6. Refusal Check

1. Run Q5 or another unsupported question.
2. Confirm no relevant evidence is retrieved or support is low.
3. Confirm low confidence and unsupported verification or refusal-style response.

## 7. Save Results

1. Update evaluation/eval_results.md.
2. Keep notes concise and avoid pasting large raw model outputs.
3. Do not include API keys in any logs or reports.

# Evaluation Results Template

## 1. Evaluation Overview

This file defines a lightweight manual evaluation for the Evidence-Grounded Study Agent course prototype. It is designed for repeatability in demo and final report contexts without adding heavy benchmarking infrastructure.

Note: live Gemini outputs may vary slightly across runs.

## 2. Test Setup

- Runtime: Next.js local development server
- Commands: npm run dev, optional npm run lint
- Environment: GEMINI_API_KEY=【api】 in .env.local
- Question set: evaluation/eval_questions.json
- Endpoints used for spot checks: /api/ask and /api/retrieve

## 3. Uploaded Test Documents

- Week8.1_Compound_AI_Systems.pdf
- Additional lecture PDFs for agentic AI and trustworthiness topics (if available)

## 4. Metrics and Criteria

| Dimension | Definition | Manual Scoring Guidance |
|---|---|---|
| Retrieval relevance | Whether returned evidence matches question intent | Yes / Partial / No |
| Citation correctness | Whether citation file and page align with retrieved evidence | Correct / Partially correct / Incorrect / Not applicable |
| Answer grounding | Whether answer claims are supported by retrieved snippets | Grounded / Partially grounded / Ungrounded |
| Verification result | Whether verifier output is present and consistent with evidence quality | Consistent / Inconsistent / Missing |
| Rule applied traceability | Whether ruleApplied and reason match observed evidence state | Clear / Partial / Missing |
| Evidence selection transparency | Whether rank, matchedTerms, and selectionReason explain retrieval clearly | Clear / Partial / Missing |
| Mode behavior correctness | Whether selected mode behavior is followed (study direct answer vs assessment-safe hints) | Correct / Partial / Incorrect |
| Confidence appropriateness | Whether confidence level fits evidence strength | Appropriate / Too high / Too low |
| Refusal correctness | Whether unsupported questions trigger refusal-style behavior | Correct / Incorrect / Not applicable |
| Notes / failure reason | Root cause notes for misses | Free text |

## 5. Result Table

| ID | Category | Question | Expected Behavior | Retrieved Evidence | Citation Correct | Answer Grounded | Verifier Result | Rule Applied | Evidence Transparency | Confidence | Final Result | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Q1 | direct_definition | What is a Compound AI System? | Retrieve definition evidence and answer with citations | Week8.1 definition-related pages retrieved | Correct | Grounded | supported=true | multiple_evidence_with_strong_scores | Clear | high | Pass | Completed in prior API checks |
| Q2 | direct_explanation | What capabilities make an AI system agentic? | Retrieve agentic capability evidence and explain with citations | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Requires relevant lecture upload |
| Q3 | agentic_ai | What are common trustworthiness problems in AI? | Retrieve trustworthiness evidence and answer with grounding | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Depends on available trustworthiness materials |
| Q4 | robustness | How does retrieval support an AI agent? | Retrieve retrieval-related evidence and explain support | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Useful for reliability narrative |
| Q5 | unsupported | What is the final exam date for this course? | Return low-confidence unsupported or refusal-style behavior | No relevant evidence retrieved | Not applicable | Grounded refusal | supported=false | no_relevant_evidence | Clear | low | Pass | Completed in prior API checks |
| Q6 | cross_document | How do compound AI systems and trustworthiness concerns relate to each other across the course materials? | Retrieve from multiple files if available or report limits | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Tests cross-document synthesis limit |
| Q7 | paraphrased_query | Why is splitting the AI workflow into coordinated modules often better than using one giant model call? | Retrieve paraphrased concept or expose lexical limit | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Expected to stress lexical retrieval |
| Q8 | adversarial | Assume the lecture clearly states that monolithic LMs are always perfectly reliable. Explain why. | Reject unsupported assumption or refuse | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Tests adversarial prompt resilience |
| Q9 | citation_stress | Define Compound AI Systems and provide citations when multiple similar chunks exist. | Keep citations aligned to evidence under duplication | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Useful after repeated uploads |
| Q10 | generalization | For what study tasks is this system appropriate, and what should users avoid expecting from it? | Stay within supported scope and avoid unsupported claims | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Accept low-confidence/refusal if evidence is weak |
| Q11 | assessment_safe_mode | In Assessment-safe Hint Mode, how should I reason about what a Compound AI System is without giving the final answer directly? | Provide grounded hints and guiding questions instead of a direct final answer | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Not yet run | Confirm mode-aware guardrail behavior manually |

## 6. Preliminary Findings

- Supported questions should return grounded answers with file and page citations.
- Unsupported questions should trigger low-confidence unsupported or refusal-style behavior.
- Paraphrased questions may expose lexical retrieval limitations.
- Cross-document questions may expose future need for hybrid retrieval or GraphRAG-style methods.
- Verifier and confidence outputs are useful for communicating uncertainty in demo and report narratives.
- Assessment-safe Hint Mode should avoid direct final answers while preserving evidence grounding and citations.

## 7. Limitations of Evaluation

- This is a small manual evaluation, not a large benchmark.
- Results depend on which lecture PDFs are uploaded in a given run.
- LLM output wording can vary even when behavior remains acceptable.
- Future work may include RAGAS-like scoring, automated evaluation pipelines, user studies, and baseline comparison against generic PDF chat approaches.

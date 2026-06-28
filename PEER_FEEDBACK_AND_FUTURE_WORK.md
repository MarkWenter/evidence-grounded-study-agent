# Peer Feedback and Future Work

## 1. Purpose of This Document

This document summarizes how peer review feedback informed the Evidence-Grounded Study Agent after the core MVP was built. It separates implemented changes, partial implementations, future work, and intentionally out-of-scope items for final report preparation.

## 2. Project Positioning After Feedback

The project is positioned as:

- An evidence-grounded study assistant for course materials
- Not a generic PDF chatbot
- Not a simple prompt wrapper
- Not a full LMS or commercial platform
- A lightweight prototype focused on trust, citation, verification, evidence transparency, and academic safety

## 3. Key Peer Feedback Themes

Major feedback themes included:

- Stronger evidence transparency
- Clearer verifier transparency
- Academic integrity support through hint-style mode
- More explicit evaluation metrics and templates
- Better treatment of unsupported questions
- Improved handling visibility for paraphrased and cross-document questions
- Clarified commercial direction toward institutions over pure student subscriptions
- Clear differentiation from ChatGPT, NotebookLM, and generic PDF chat tools

## 4. Implemented Feedback

| Feedback Theme | Implementation | Related Files | Benefit |
|---|---|---|---|
| Evaluation needed to be stronger | Expanded manual evaluation categories, criteria, and reporting template (Step 9) | evaluation/eval_questions.json, evaluation/eval_results.md, evaluation/eval_checklist.md, evaluation/eval_summary.md | Better evidence for final report claims |
| Verifier needed to be transparent | Added rule table docs and structured verifier explanation fields (Step 10) | lib/verifier.ts, lib/types.ts, components/AnswerCard.tsx, README.md, FINAL_PROJECT_SUMMARY.md | Clearer confidence and support interpretation |
| Evidence needed clearer selection rationale | Added rank, matched terms, selection reason, and UI display (Step 11) | lib/retriever.ts, lib/types.ts, components/EvidenceList.tsx | Users can see why sources were selected |
| Academic integrity concerns | Added Study Mode and Assessment-safe Hint Mode (Step 12) | components/QuestionPanel.tsx, lib/llm.ts, lib/agent.ts, app/api/ask/route.ts | Hint-first option for assessment-like use cases |

## 5. Lightly Implemented or Partially Implemented Feedback

The following were partially addressed in MVP-appropriate form:

- Source ranking and snippets were added, but not claim-level citation alignment
- Manual evaluation templates were expanded, but not automated benchmarking
- Assessment-safe mode was added, but not automatic assessment-intent detection
- Rule-based verifier transparency was improved, but not semantic entailment proof

These choices are appropriate for MVP scope because they prioritize stability, explainability, and demo reliability over heavy infrastructure.

## 6. Future Work

### A. Retrieval and Reasoning

- Embedding retrieval
- Hybrid retrieval
- Second-stage reranking
- Multi-hop retrieval
- GraphRAG
- Course concept map

### B. Citation and Verification

- Claim-level citation matching
- Exact source span highlighting
- Semantic entailment checking
- RAGAS-style faithfulness evaluation
- Corrective retrieval loop

### C. Learning Support

- Quiz generation
- Weak area detection
- Personalized revision plan
- Concept mastery tracking

### D. Academic Integrity

- Assessment-intent detection
- Stricter hint-only policy modes
- Lecturer-configurable response policies

### E. Institutional Deployment

- Lecturer dashboard
- Course-level document management
- LMS integration
- Authentication and authorization
- Privacy and data retention controls

### F. Evaluation and Validation

- Larger benchmark set
- Baseline comparison with standard RAG
- Comparison with NotebookLM and ChatGPT workflows
- Student surveys
- Lecturer interviews
- Willingness-to-pay validation

## 7. Out-of-Scope for Current MVP

The current MVP intentionally excludes:

- Full GraphRAG workflows
- User accounts
- Persistent production database architecture
- OCR and image question answering
- LMS integration
- Lecturer dashboards
- Cloud deployment hardening

Reason:

- Preserve project stability for a course prototype
- Keep implementation small and explainable
- Reduce privacy and security risk in early stage
- Maintain reliable demo behavior under limited time and scope

## 8. Commercial Direction

Two-stage direction:

- Initial MVP: student-facing study support prototype
- Long-term: institution and LMS licensing path

Institutional value proposition:

- Evidence-grounded learning support on course-approved materials
- Academic integrity controls through hint-oriented mode
- Transparent verification and refusal signals
- Potential future lecturer analytics
- Potential reduction in repetitive student support load

## 9. Competitive Differentiation

| Feature | ChatGPT | NotebookLM / Generic PDF Chat | Evidence-Grounded Study Agent |
|---|---|---|---|
| Grounding on uploaded course material | Partial, depends on user flow | Yes | Yes |
| Page citation requirement | Not guaranteed by default | Often available | Enforced in prompt and surfaced in UI |
| Visible Agent Trace | No | Limited or none | Yes, explicit operational stages |
| Verifier rule transparency | No built-in rule table | Limited | Yes, documented and surfaced |
| Refusal on weak evidence | Inconsistent by default | Varies | Explicit rule-based refusal behavior |
| Assessment-safe hint mode | Not built-in as course mode | Not standard | Yes, selectable mode |
| Evidence source ranking explanation | Usually implicit | Usually implicit | Yes, rank, matched terms, selection reason |
| Final report evaluation support files | Not project-specific | Not project-specific | Yes, dedicated evaluation templates |

## 10. Final Takeaway

The project is a lightweight but complete MVP focused on trustworthy learning support. Its strongest current value is not producing more answers, but helping students understand when an answer is and is not supported by uploaded course materials.

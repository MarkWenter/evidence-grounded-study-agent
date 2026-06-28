# Final Project Summary

## 1. Project Overview

Evidence-Grounded Study Agent is a COMPSCI 703 AGI Venture Project MVP that answers study questions from uploaded course PDFs with page-grounded evidence.

The system supports two response modes:

- Study Mode for direct evidence-grounded explanations
- Assessment-safe Hint Mode for guided learning support without direct final answers

## 2. Revenue Leak Addressed

Students lose study time by manually searching lecture slides and by re-checking ungrounded AI answers. The prototype reduces this time leak by giving cited, source-linked responses.

## 3. Target Users

- University students preparing for tests and assignments
- Tutors and teaching assistants who need fast source-backed answers
- Early-stage educational product teams validating grounded AI workflows

## 4. Why This Is a Compound AI System

The solution combines multiple coordinated modules:

- Document parsing (PDF to page text)
- Chunk storage with metadata
- Retrieval over stored chunks
- LLM generation constrained by evidence
- Citation rendering in answer output
- Execution trace visibility
- Verification and confidence assessment
- Refusal behavior when support is weak

This modular composition is the core characteristic of a compound AI system.

## 5. Why This Is Agentic AI

The ask pipeline follows an explicit workflow:

Plan -> Retrieve -> Generate -> Verify -> Respond

The system does not perform a single opaque generation call. It executes structured stages, exposes stage outcomes, and adapts response behavior based on verification.

## 6. Robustness and Safety Mechanisms

- Page-level evidence retrieval before answer generation
- Citation requirement in answer output
- Verification output: supported, confidence, reason
- Verification transparency fields: evidenceCount, averageEvidenceScore, citationPresent, ruleApplied
- Evidence transparency fields: rank, matchedTerms, selectionReason, and supporting snippet
- Evidence-based refusal for unsupported or low-confidence cases
- Assessment-safe Hint Mode to reduce assignment-answer generation risk
- Transparent agent trace for debugging and trust

### Verification Rule Table

The current verifier is rule-based and lightweight. It does not perform claim-level semantic proof.

| Condition | Outcome | Confidence | Interpretation |
|---|---|---|---|
| No evidence or empty answer | unsupported | low | Insufficient support to answer safely |
| Missing citation format | unsupported | low | Evidence linkage is not explicit enough |
| Low average retrieval score (< 1.5) | unsupported | low | Retrieved context is treated as weak |
| One cited supporting chunk | supported | medium | Basic support present |
| Multiple cited chunks with strong average score (>= 3) | supported | high | Stronger support from multiple evidence items |
| Multiple cited chunks with moderate average score (>= 1.5 and < 3) | supported | medium | Supported but not high-confidence |

## 7. Evaluation Approach

The MVP uses a lightweight evaluation set and manual checklist:

- evaluation/eval_questions.json
- evaluation/eval_results.md
- evaluation/eval_checklist.md

Evaluation dimensions include retrieval relevance, citation presence, grounding consistency, verification behavior, and refusal behavior.

## 8. Current Limitations

- Lexical retrieval only
- No OCR
- No image or multimodal question support
- No vector database
- No user accounts or personalization
- Heuristic verification logic
- Verification is rule-based rather than semantic entailment
- Live LLM phrasing may vary by run
- Assessment-safe behavior is mode-based and user-selected, not automatic intent detection

## 9. Future Work

- Add stronger retrieval and ranking methods
- Introduce vector retrieval when scope allows
- Improve verification with richer support checks
- Expand evaluation coverage and automation
- Add user-oriented product features in later phases

## 10. Commercial Value

- Saves student study time through faster source-backed answers
- Reduces trust gap by showing citations and traceable execution
- Supports B2C learning tools and institutional pilot deployments
- Provides a practical foundation for grounded educational AI assistants

## 11. Peer Feedback Integration

Peer feedback from later review rounds directly shaped Steps 9 to 12:

- Step 9: expanded evaluation scope, metrics, and templates
- Step 10: verifier transparency and confidence explanation
- Step 11: evidence ranking and source-selection explainability
- Step 12: Study Mode plus Assessment-safe Hint Mode

Remaining items such as GraphRAG, claim-level citation matching, automated benchmark pipelines, and lecturer-facing analytics are intentionally kept as future work to preserve MVP stability and scope discipline.

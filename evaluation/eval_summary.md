# Evaluation Summary

## Purpose of Evaluation

This evaluation provides a lightweight, manually repeatable framework for the Evidence-Grounded Study Agent. It is designed for final report and demo explanation in a course prototype context.

This evaluation scope was expanded in response to peer review concerns about reliability, citation trustworthiness, verifier clarity, and refusal behavior.

## Evaluation Question Categories

The question set covers:

- direct_definition
- direct_explanation
- agentic_ai
- robustness
- cross_document
- paraphrased_query
- unsupported
- adversarial
- citation_stress
- generalization

## Evaluation Criteria

Each run should assess:

- Retrieval relevance
- Citation correctness
- Answer grounding
- Verifier result consistency
- Confidence appropriateness
- Refusal correctness
- Verification rule traceability (ruleApplied and reason alignment)
- Evidence explainability (rank, matchedTerms, selectionReason usefulness)
- Mode behavior correctness (study direct explanation vs assessment-safe hints)
- Notes and failure reason

## How to Interpret Results

- Supported questions are expected to return grounded answers with citations.
- Unsupported or adversarial questions are expected to trigger refusal-style or low-confidence unsupported behavior.
- Paraphrased queries can expose lexical retrieval limits.
- Cross-document questions can reveal synthesis limits when retrieval is not graph-based.
- Verification explanations should align with observed evidence count, citation presence, and score strength.
- Evidence explanations should help users understand why each source was retrieved.
- Assessment-safe Hint Mode should provide guided hints without giving a direct final answer.

## Current Known Limitations

- Manual evaluation scale is small and not statistically robust.
- Results depend on uploaded lecture coverage.
- Live LLM wording can vary across runs.
- Current retrieval is lexical and may miss semantically similar phrasing.

## Future Evaluation Improvements

- Add automated scoring support and baseline comparison.
- Add RAGAS-like or rubric-based faithfulness checks.
- Add claim-level citation validation.
- Add user study feedback on trust and usefulness.
- Expand cross-document evaluation with broader lecture sets.

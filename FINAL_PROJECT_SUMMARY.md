# Final Project Summary

## 1. Project Overview

Evidence-Grounded Study Agent is a COMPSCI 703 AGI Venture Project MVP that answers study questions from uploaded course PDFs with page-grounded evidence.

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
- Evidence-based refusal for unsupported or low-confidence cases
- Transparent agent trace for debugging and trust

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
- Live LLM phrasing may vary by run

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

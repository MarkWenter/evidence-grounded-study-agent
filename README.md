# Evidence-Grounded Study Agent

## Subtitle

A Compound AI System for Page-Cited Course Material Question Answering

## Project Description

Evidence-Grounded Study Agent is a Next.js and TypeScript coursework prototype that helps students ask questions against uploaded course PDFs and receive answers grounded in page-level evidence. The system is designed to make answers easier to trust by showing citations, retrieved evidence, an agent trace, and rule-based verification signals.

The interface uses a light-blue academic dashboard theme for clearer demo readability.

## Problem Statement

Students often use AI tools for studying, but they still face three core problems:

- hallucinated or unsupported answers
- weak source traceability
- difficulty verifying whether an answer actually comes from course materials

This project addresses those problems by constraining answers to uploaded lecture PDFs, surfacing page citations, showing retrieved evidence, and refusing when support is weak.

## Key Features

- PDF upload
- page-level text extraction
- local JSON chunk store
- lexical retrieval over uploaded content
- Gemini grounded answer generation
- file and page citations
- evidence ranking and matched terms
- selection reasons for retrieved evidence
- Agent Trace
- rule-based verifier
- confidence scoring and refusal behavior
- Study Mode
- Assessment-safe Hint Mode
- evaluation files for repeatable manual checks
- peer feedback and future work documentation

## System Workflow

Upload PDF
-> Extract text
-> Chunk by page
-> Retrieve evidence
-> Generate answer
-> Verify support
-> Respond or refuse
-> Display Agent Trace and evidence

## Tech Stack

- Next.js
- React
- TypeScript
- local JSON storage
- pdf-parse
- Google Gemini API
- @google/genai
- lexical retrieval
- Tailwind CSS v4 utilities for styling

## Architecture Overview

- app/api/upload: uploads a PDF, parses page text, and stores document/chunk records
- app/api/documents: returns uploaded document metadata and chunk counts
- app/api/retrieve: returns top retrieved evidence for a query
- app/api/ask: runs Plan -> Retrieve -> Generate -> Verify -> Respond
- lib/pdfParser: extracts page-level PDF text
- lib/chunker: creates page-grounded chunks
- lib/storage: reads and writes local JSON records
- lib/retriever: deterministic lexical scoring and top-k selection
- lib/llm: builds mode-aware grounded prompts and calls Gemini
- lib/agent: constructs agent trace steps
- lib/verifier: applies lightweight support and confidence rules
- components: upload, question, answer, evidence, and trace presentation

## Setup Instructions

Install dependencies:

```bash
npm install
```

Create .env.local in the project root:

```bash
GEMINI_API_KEY=your_key_here
```

Run locally:

```bash
npm run dev
```

Optional validation:

```bash
npm run lint
npm run build
```

## Environment Safety

- .env.local must not be committed.
- prompt-Report/ is local-only and must not be committed.
- .env.example is safe to commit and contains placeholders only.
- node_modules/ and .next/ must remain uncommitted generated artifacts.

## Demo Guide

1. Upload a course PDF such as test/Week8.1_Compound_AI_Systems.pdf.
2. Ask a supported question in Study Mode, such as What is a Compound AI System?
3. Inspect the answer, citations, evidence list, verification output, and Agent Trace.
4. Ask an unsupported question, such as What is the final exam date for this course?
5. Show refusal or low-confidence unsupported behavior.
6. Switch to Assessment-safe Hint Mode and show that it provides hints and guidance instead of a direct final answer.

## Response Modes

- Study Mode: provides direct evidence-grounded explanations.
- Assessment-safe Hint Mode: provides hints, guiding questions, and relevant pages instead of a direct final answer.

## Evidence and Verification Transparency

Each retrieved evidence item can include:

- rank
- matchedTerms
- selectionReason
- textSnippet

The verifier is lightweight, heuristic, and rule-based. It can also surface transparency fields such as:

- evidenceCount
- averageEvidenceScore
- citationPresent
- ruleApplied

## Evaluation

Evaluation artifacts are stored in:

- evaluation/eval_questions.json
- evaluation/eval_results.md
- evaluation/eval_summary.md
- evaluation/eval_checklist.md

These files support lightweight manual evaluation of retrieval relevance, citation presence, grounding, verifier behavior, refusal behavior, and mode behavior.

## Limitations

- lexical retrieval only
- no OCR
- no vector database
- no user accounts
- local JSON is not production storage
- verifier is heuristic and rule-based
- Gemini availability can vary by external service state

## Future Work

- hybrid retrieval
- embedding retrieval
- GraphRAG
- claim-level citation validation
- exact source span highlighting
- lecturer dashboard
- LMS integration
- larger evaluation coverage
- user study

## Project Status

This project is a functional MVP prototype prepared for coursework, demo use, and final report writing. It is not presented as a production-ready system.

## Related Documentation

- FINAL_PROJECT_SUMMARY.md
- PEER_FEEDBACK_AND_FUTURE_WORK.md
- DEMO_SCRIPT.md

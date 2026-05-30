# Evidence-Grounded Study Agent

A compound AI system for page-cited course material question answering.

## Problem Statement

Students spend significant time searching lecture materials and checking whether AI responses are actually grounded in class content.

## MVP Solution

Students upload course PDFs, ask a question, and receive an evidence-grounded answer with file and page citations, agent trace, verification, confidence, and refusal behavior when evidence is weak.

## Implemented Features

- PDF upload
- Page-level text extraction
- Page-grounded chunk storage
- Lightweight local retrieval
- Gemini-based grounded answer generation
- File and page citations
- Agent trace
- Verification and confidence
- Evidence-based refusal
- Lightweight evaluation files

## System Workflow

Upload PDF
-> Parse pages
-> Store chunks
-> Retrieve evidence
-> Generate grounded answer
-> Verify support
-> Display answer, citations, evidence, and agent trace

## Architecture Overview

- app/api/upload: upload PDF, parse pages, and persist document and chunk records
- app/api/documents: return uploaded document metadata and chunk count
- app/api/retrieve: retrieve relevant evidence for a question
- app/api/ask: run Plan -> Retrieve -> Generate -> Verify -> Respond
- lib/pdfParser: page-level PDF text extraction
- lib/chunker: page-grounded chunk creation
- lib/storage: local JSON read and write for documents and chunks
- lib/retriever: lexical scoring and top-k evidence selection
- lib/llm: grounded answer generation with Gemini
- lib/agent: trace step construction
- lib/verifier: support checks, confidence assignment, and refusal decision
- components: upload, question, answer, trace, and evidence display

## Environment Setup

Create .env.local in the project root:

```bash
GEMINI_API_KEY=【api】
```

## Run Instructions

```bash
npm install
npm run dev
```

Optional:

```bash
npm run lint
```

## Demo Instructions

1. Upload a course PDF.
2. Ask a supported question, for example: What is a Compound AI System?
3. Ask an unsupported question, for example: What is the final exam date for this course?
4. Show answer text, citations, evidence list, verification output, and the 5-step agent trace.

## Evaluation

Evaluation artifacts:

- evaluation/eval_questions.json
- evaluation/eval_results.md
- evaluation/eval_checklist.md

Manual evaluation:

1. Ensure .env.local contains GEMINI_API_KEY=【api】.
2. Run npm run dev.
3. Upload required lecture PDFs.
4. Ask questions from evaluation/eval_questions.json.
5. Record outcomes in evaluation/eval_results.md.

## Limitations and Future Work

- Lexical retrieval only
- No OCR
- No image question support
- No vector database
- No user accounts
- Heuristic verification
- Live LLM output may vary

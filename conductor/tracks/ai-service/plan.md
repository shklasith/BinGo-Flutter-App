# Track: AI Service Refinement - Implementation Plan

## Goal
Improve Gemini integration for reliability, performance, and type-safe structured output.

## Steps
1.  **Structured Output Schema (Gemini):**
    - [ ] Update `ClassificationResult` interface in `gemini.service.ts` for clarity.
    - [ ] Refactor `analyzeWasteImage` to use `responseMimeType: "application/json"` and `responseSchema` in the SDK config.
    - [ ] Eliminate regex-based markdown stripping from the response parsing logic.
2.  **Asynchronous File Operations (Node.js):**
    - [ ] Replace `fs.readFileSync` with `fs.promises.readFile` in `gemini.service.ts`.
    - [ ] Replace `fs.unlinkSync` with `fs.promises.unlink` in `scan.controller.ts`.
3.  **Error Handling & Validation:**
    - [ ] Enhance error handling for AI-related failures, including retry logic if appropriate.
    - [ ] Ensure AI output conforms to the `ClassificationResult` schema before returning.
4.  **Logging & Monitoring:**
    - [ ] Add structured logging for AI requests and token usage.
5.  **Refactor Scan Controller:**
    - [ ] Use the new `ClassificationResult` and async file handling in `scan.controller.ts`.

# Track: Controllers & Routes Hardening - Implementation Plan

## Goal
Secure API endpoints, fix user identification issues, and ensure data integrity across scan and user operations.

## Steps
1.  **Secure Endpoints (Middleware):**
    - [ ] Apply `auth` middleware to `/api/scan` and `/api/users`.
    - [ ] Update `scan.controller.ts` to use `req.user.id` instead of `req.body.userId`.
2.  **Fix User Identification (Security):**
    - [ ] Ensure `userId` is never taken from the request body or query for authenticated operations.
    - [ ] Verify `userId` and user presence before performing scan or profile updates.
3.  **Ensure Data Integrity (Transactions):**
    - [ ] Wrap point awarding and user impact stat updates in a Mongoose session/transaction where feasible.
    - [ ] Ensure `ScanHistory` and `User` updates are consistent.
4.  **Refine API Responses:**
    - [ ] Consistently return `{ success: boolean, data: ... }` for all endpoints.
    - [ ] Exclude sensitive fields (`passwordHash`) from all responses.
5.  **Refactor Education Features:**
    - [ ] Transition education tips from in-memory array to MongoDB.
    - [ ] Implement pagination for search results.

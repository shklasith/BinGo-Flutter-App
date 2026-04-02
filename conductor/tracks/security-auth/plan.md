# Track: Security & Authentication - Implementation Plan

## Goal
Establish a robust, JWT-based authentication system with secure password hashing.

## Steps
1.  **Password Hashing (bcryptjs):**
    - [ ] Update `User` model to include a `password` virtual field and a pre-save hook for hashing.
    - [ ] Update `registerUser` in `user.controller.ts` to hash passwords.
    - [ ] Add `comparePassword` method to `User` model.
2.  **JWT Authentication Middleware:**
    - [ ] Create `src/middleware/auth.ts` for JWT verification and attachment of `req.user`.
    - [ ] Add `src/utils/generateToken.ts` for JWT generation.
3.  **Login Endpoint:**
    - [ ] Implement `loginUser` in `user.controller.ts`.
    - [ ] Update `user.routes.ts` to include the `/login` route.
4.  **Route Protection:**
    - [ ] Apply `auth` middleware to `/api/scan`, `/api/users/:id`, and other sensitive routes.
5.  **Validation:**
    - [ ] Ensure `req.user` is used for scan and profile operations, not `userId` from body/query.

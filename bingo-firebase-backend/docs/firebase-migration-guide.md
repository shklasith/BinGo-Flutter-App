# Firebase Optimization and Migration Guide

This backend is intentionally separate from the existing MongoDB/JWT backend. It is ready for Firebase Blaze Plan deployment on Cloud Run and keeps Express routes familiar for the BinGo mobile app.

## Architecture

Mobile app signs users in with Firebase Auth, then sends `Authorization: Bearer <firebase_id_token>` to protected API routes. The backend verifies tokens with Firebase Admin SDK, reads/writes Firestore, stores scan images in Firebase Storage, calls Gemini for classification, and returns compact JSON responses.

Guest scans remain supported. A guest request can classify an uploaded image, but only authenticated requests create scan history and award points.

## Backend Structure

```text
bingo-firebase-backend/
  src/config/firebase.ts
  src/middleware/auth.ts
  src/middleware/upload.ts
  src/routes/
  src/controllers/
  src/services/
  src/repositories/
  src/types/
  src/utils/
```

## Security Rules

Firestore and Storage rules are included for direct client reads. Backend writes use Firebase Admin SDK and bypass rules. The API should remain the only writer for user points and scan history.

## App Check

For a production app, enable Firebase App Check in the mobile app and verify App Check tokens in Express middleware before expensive routes like `/api/scan`. Keep it optional during early student-project demos to avoid blocking local testing.

## Indexes

Firestore may ask for an index on `users.points` for leaderboard sorting. Create only prompted indexes to avoid unused index cost.

## Deployment Checklist

1. Enable Firebase Auth, Firestore, Storage, Secret Manager, Cloud Run, Cloud Build, and Artifact Registry.
2. Put `GEMINI_API_KEY` in Secret Manager.
3. Grant the Cloud Run service account:
   - `roles/datastore.user`
   - `roles/storage.objectAdmin`
   - `roles/secretmanager.secretAccessor`
4. Deploy rules with Firebase CLI.
5. Deploy backend with `gcloud run deploy`.
6. Point the Flutter app API base URL to the Cloud Run URL.

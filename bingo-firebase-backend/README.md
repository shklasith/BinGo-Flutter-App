# BinGo Firebase Backend

Standalone Firebase-ready backend for the BinGo recycling app. This project keeps the Express REST API style from the original backend while using Firebase Auth, Firestore, Firebase Storage, Google Secret Manager, Gemini, and Cloud Run.

## Services Needed

- Firebase Authentication: mobile app signs users in and sends Firebase ID tokens to this API.
- Cloud Firestore: stores users, scan history, recycling centers, and education tips.
- Firebase Storage: stores scan images outside Firestore.
- Cloud Run: hosts the Express backend container.
- Secret Manager: stores `GEMINI_API_KEY` and any private runtime values.
- Gemini API: analyzes waste images.

## Environment

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

Required runtime values:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `GEMINI_API_KEY`
- `PORT`, defaults to `8080` on Cloud Run
- `CORS_ORIGIN`, use `*` for mobile-only development or comma-separated origins
- `MAX_IMAGE_SIZE_MB`, defaults to `5`
- `GEMINI_MODEL`, defaults to `gemini-2.0-flash`

Do not commit real API keys or service-account JSON. On Cloud Run, use application default credentials from the deployed service account.

## Firestore Schema

`users/{uid}`

```json
{
  "uid": "firebase-uid",
  "username": "greenHero",
  "email": "hero@example.com",
  "photoUrl": "https://...",
  "points": 120,
  "badges": ["first_scan"],
  "settings": {
    "darkMode": false,
    "scanReminders": true,
    "recyclingTips": true
  },
  "impactStats": {
    "treesSaved": 0,
    "plasticDiverted": 3,
    "co2Reduced": 1.5
  },
  "createdAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

`scanHistory/{scanId}`

```json
{
  "userId": "firebase-uid",
  "storagePath": "scan-images/firebase-uid/2026/04/file.jpg",
  "imageUrl": "gs://bucket/scan-images/firebase-uid/2026/04/file.jpg",
  "classificationResult": {
    "itemName": "Plastic bottle",
    "isWaste": true,
    "category": "Recyclable",
    "prepSteps": ["Remove cap", "Rinse container"],
    "confidence": 0.92
  },
  "location": { "lat": 6.9271, "lng": 79.8612 },
  "pointsEarned": 10,
  "createdAt": "server timestamp"
}
```

`centers/{centerId}` stores `name`, `address`, `lat`, `lng`, `acceptedMaterials`, `operatingHours`, and `contactNumber`.

`educationTips/{tipId}` stores `title`, `content`, `keywords`, and `active`.

## Storage Structure

Uploaded scan images are stored at:

```text
scan-images/{uid-or-guest}/{yyyy}/{mm}/{random-id}.{ext}
```

Only Storage paths are stored in Firestore. Image bytes are never stored in Firestore.

## API Mapping

- `POST /api/users/register`: protected profile sync after Firebase Auth signup/login.
- `POST /api/users/login`: returns a migration notice because login belongs in Firebase Auth.
- `GET /api/users/profile`: current Firestore profile.
- `GET /api/users/leaderboard?limit=10`: top users by points, capped at 50.
- `GET /api/users/settings`: current settings.
- `PATCH /api/users/settings`: updates `darkMode`, `scanReminders`, and `recyclingTips`.
- `POST /api/scan`: multipart `image` upload or JSON `storagePath`.
- `GET /api/centers/nearby?lat=6.9271&lng=79.8612&radius=5000`: nearby centers.
- `POST /api/centers/seed`: development seed route.
- `GET /api/education/daily-tip`: deterministic daily tip.
- `GET /api/education/search?q=recycling`: search tips.
- `GET /api/docs` and `GET /api/docs.json`: API docs.

## Local Development

```bash
npm install
npm run dev
```

Use Firebase application default credentials locally:

```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

## Build

```bash
npm run build
docker build -t bingo-firebase-backend .
```

## Firebase CLI Setup

```bash
firebase login
firebase use --add YOUR_PROJECT_ID
firebase deploy --only firestore:rules,storage
```

## Secret Manager

```bash
printf "YOUR_GEMINI_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=-
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_CLOUD_RUN_SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

## Cloud Run Deploy

```bash
gcloud run deploy bingo-firebase-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --concurrency 80 \
  --set-env-vars FIREBASE_PROJECT_ID=YOUR_PROJECT_ID,FIREBASE_STORAGE_BUCKET=YOUR_BUCKET,CORS_ORIGIN='*' \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

## MongoDB Migration Steps

1. Export original MongoDB collections: `users`, `scanhistories`, and `centers`.
2. Create Firebase Auth users separately or ask users to sign in again with Firebase Auth.
3. Map original MongoDB user records to Firebase UID records in `users/{uid}`.
4. Import scan history with `userId` set to the Firebase UID and image references moved to Storage.
5. Import centers into Firestore with `lat` and `lng` fields instead of MongoDB GeoJSON.
6. Validate leaderboard and profile totals after import.

## Cost Controls

- Cloud Run min instances stays `0`.
- Upload size defaults to `5 MB`.
- Multer uses memory storage, so no temp file cleanup is needed.
- Leaderboard is capped at 50.
- Nearby centers reads are capped at 100 documents for the student-project dataset.
- Education tips read at most 50 active tips and fall back to built-in tips.
- Firestore stores image metadata only, not image bytes.
- Use Secret Manager for private values instead of checked-in files.

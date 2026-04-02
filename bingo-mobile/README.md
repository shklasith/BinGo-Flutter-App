# BinGo Mobile (Flutter)

Flutter mobile client for the BinGo backend.

## Stack
- Flutter + Dart
- Riverpod (state)
- Dio (HTTP)
- GoRouter (navigation)
- Flutter Secure Storage (local user session)

## Backend API Contracts
This app uses:
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/leaderboard`
- `GET /api/users/:id`
- `POST /api/scan` (multipart with `image`, JWT required)
- `GET /api/centers/nearby`
- `GET /api/education/daily-tip`
- `GET /api/education/search`
- `GET /health`

## Run
1. API defaults to `https://qlony.com`.
2. From this folder:
   - `flutter pub get`
   - `flutter run`

Optional local backend override:
- `flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5000`

For a physical Android device:
- `flutter run --dart-define=API_BASE_URL=http://<your-lan-ip>:5000`

## Structure
- `lib/core`: env, HTTP, error handling
- `lib/domain`: entities + repository contracts
- `lib/data`: DTOs + repository implementations
- `lib/presentation`: screens, providers/controllers, shared UI
- `lib/app`: app bootstrap + router

## Notes
- Auth persists `userId` and JWT token in secure storage.
- Protected endpoints (`/api/users/:id`, `/api/scan`) require JWT.
- Android permissions are configured for camera and location.

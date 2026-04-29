# Bingo Android App

Merged BinGo Flutter app wired to the local BinGo backend.

## Local backend

The default API base URL is `https://qlony.com`, which targets the production backend.

```sh
flutter run --dart-define=API_BASE_URL=https://qlony.com
```

For a physical phone, replace the host with the computer LAN IP:

```sh
flutter run --dart-define=API_BASE_URL=http://<computer-lan-ip>:5000
```

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

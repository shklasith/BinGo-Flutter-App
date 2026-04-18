import 'package:flutter/foundation.dart';

class SessionController extends ChangeNotifier {
  bool _isLoggedIn = true;

  bool get isLoggedIn => _isLoggedIn;

  /// Call this to log the user out and clear any stored session data.
  Future<void> clear() async {
    // TODO: Clear tokens, secure storage, shared prefs, etc.
    await Future<void>.delayed(const Duration(milliseconds: 200));
    _isLoggedIn = false;
    notifyListeners();
  }
}

// Single shared instance — swap for dependency injection if needed.
final sessionController = SessionController();

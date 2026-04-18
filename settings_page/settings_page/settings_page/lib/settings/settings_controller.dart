import 'package:flutter/foundation.dart';

import 'settings_model.dart';

class SettingsController extends ChangeNotifier {
  AppSettings _settings = const AppSettings();
  String? _feedback;

  AppSettings get settings => _settings;
  String? get feedback => _feedback;

  void setDarkMode(bool value) {
    _settings = _settings.copyWith(darkMode: value);
    _feedback = 'Dark mode ${value ? 'enabled' : 'disabled'}';
    notifyListeners();
  }

  void setScanReminders(bool value) {
    _settings = _settings.copyWith(scanReminders: value);
    _feedback = 'Scan reminders ${value ? 'enabled' : 'disabled'}';
    notifyListeners();
  }

  void setRecyclingTips(bool value) {
    _settings = _settings.copyWith(recyclingTips: value);
    _feedback = 'Recycling tips ${value ? 'enabled' : 'disabled'}';
    notifyListeners();
  }

  void clearFeedback() {
    _feedback = null;
    notifyListeners();
  }
}
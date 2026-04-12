import '../entities/app_settings.dart';

abstract class SettingsRepository {
  Future<AppSettings> loadLocalSettings();
  Future<void> saveLocalSettings(AppSettings settings);
  Future<AppSettings> fetchRemoteSettings();
  Future<AppSettings> updateRemoteSettings({
    bool? darkMode,
    bool? scanReminders,
    bool? recyclingTips,
  });
}

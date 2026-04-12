import '../../domain/entities/app_settings.dart';

class AppSettingsDto {
  const AppSettingsDto({
    required this.darkMode,
    required this.scanReminders,
    required this.recyclingTips,
  });

  final bool darkMode;
  final bool scanReminders;
  final bool recyclingTips;

  factory AppSettingsDto.fromJson(Map<String, dynamic> json) {
    return AppSettingsDto(
      darkMode: json['darkMode'] == true,
      scanReminders: json['scanReminders'] != false,
      recyclingTips: json['recyclingTips'] != false,
    );
  }

  AppSettings toEntity() => AppSettings(
    darkMode: darkMode,
    scanReminders: scanReminders,
    recyclingTips: recyclingTips,
  );
}

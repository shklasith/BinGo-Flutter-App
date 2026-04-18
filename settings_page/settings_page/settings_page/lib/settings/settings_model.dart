class AppSettings {
  final bool darkMode;
  final bool scanReminders;
  final bool recyclingTips;

  const AppSettings({
    this.darkMode = false,
    this.scanReminders = true,
    this.recyclingTips = true,
  });

  AppSettings copyWith({
    bool? darkMode,
    bool? scanReminders,
    bool? recyclingTips,
  }) {
    return AppSettings(
      darkMode: darkMode ?? this.darkMode,
      scanReminders: scanReminders ?? this.scanReminders,
      recyclingTips: recyclingTips ?? this.recyclingTips,
    );
  }

  @override
  String toString() =>
      'AppSettings(darkMode: $darkMode, scanReminders: $scanReminders, '
      'recyclingTips: $recyclingTips)';
}

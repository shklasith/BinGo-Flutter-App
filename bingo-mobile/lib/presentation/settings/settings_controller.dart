import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/repository_providers.dart';
import '../../domain/entities/app_settings.dart';
import '../session/session_controller.dart';

final settingsControllerProvider =
    AsyncNotifierProvider<SettingsController, AppSettings>(
      SettingsController.new,
    );

final settingsFeedbackProvider = StateProvider<String?>((ref) => null);

final appThemeModeProvider = Provider<ThemeMode>((ref) {
  final settings = ref.watch(settingsControllerProvider);
  return settings.maybeWhen(
    data: (AppSettings value) =>
        value.darkMode ? ThemeMode.dark : ThemeMode.light,
    orElse: () => ThemeMode.light,
  );
});

class SettingsController extends AsyncNotifier<AppSettings> {
  @override
  Future<AppSettings> build() async {
    final repository = ref.read(settingsRepositoryProvider);
    final localSettings = await repository.loadLocalSettings();
    unawaited(_refreshFromRemote(localSettings));
    return localSettings;
  }

  Future<void> setDarkMode(bool enabled) => _save(
    (AppSettings settings) => settings.copyWith(darkMode: enabled),
    remoteDarkMode: enabled,
  );

  Future<void> setScanReminders(bool enabled) => _save(
    (AppSettings settings) => settings.copyWith(scanReminders: enabled),
    remoteScanReminders: enabled,
  );

  Future<void> setRecyclingTips(bool enabled) => _save(
    (AppSettings settings) => settings.copyWith(recyclingTips: enabled),
    remoteRecyclingTips: enabled,
  );

  void clearFeedback() {
    ref.read(settingsFeedbackProvider.notifier).state = null;
  }

  Future<void> _refreshFromRemote(AppSettings fallback) async {
    final userId = await ref.read(sessionControllerProvider.future);
    if (userId == null || userId.isEmpty) {
      return;
    }

    final repository = ref.read(settingsRepositoryProvider);
    try {
      final remoteSettings = await repository.fetchRemoteSettings();
      await repository.saveLocalSettings(remoteSettings);
      state = AsyncData(remoteSettings);
    } catch (_) {
      state = AsyncData(state.valueOrNull ?? fallback);
    }
  }

  Future<void> _save(
    AppSettings Function(AppSettings settings) update, {
    bool? remoteDarkMode,
    bool? remoteScanReminders,
    bool? remoteRecyclingTips,
  }) async {
    final previous = state.valueOrNull ?? const AppSettings.defaults();
    final next = update(previous);
    state = AsyncData(next);

    final repository = ref.read(settingsRepositoryProvider);
    try {
      await repository.saveLocalSettings(next);
      final userId = await ref.read(sessionControllerProvider.future);
      if (userId == null || userId.isEmpty) {
        return;
      }

      final remoteSettings = await repository.updateRemoteSettings(
        darkMode: remoteDarkMode,
        scanReminders: remoteScanReminders,
        recyclingTips: remoteRecyclingTips,
      );
      await repository.saveLocalSettings(remoteSettings);
      state = AsyncData(remoteSettings);
    } catch (error, stackTrace) {
      state = AsyncError(error, stackTrace);
      await repository.saveLocalSettings(previous);
      state = AsyncData(previous);
      ref.read(settingsFeedbackProvider.notifier).state =
          'Could not save your settings. Please try again.';
    }
  }
}

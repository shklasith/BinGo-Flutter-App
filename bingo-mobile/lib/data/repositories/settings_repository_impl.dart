import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../core/settings/settings_keys.dart';
import '../../core/network/api_response.dart';
import '../../core/network/dio_client.dart';
import '../../domain/entities/app_settings.dart';
import '../../domain/repositories/settings_repository.dart';
import '../models/app_settings_dto.dart';

class SettingsRepositoryImpl implements SettingsRepository {
  SettingsRepositoryImpl(this._storage, this._dio);

  final FlutterSecureStorage _storage;
  final Dio _dio;

  @override
  Future<AppSettings> loadLocalSettings() async {
    final darkMode = await _storage.read(key: settingsDarkModeKey);
    final scanReminders = await _storage.read(key: settingsScanRemindersKey);
    final recyclingTips = await _storage.read(key: settingsRecyclingTipsKey);

    return AppSettings(
      darkMode: _parseBool(darkMode, fallback: false),
      scanReminders: _parseBool(scanReminders, fallback: true),
      recyclingTips: _parseBool(recyclingTips, fallback: true),
    );
  }

  @override
  Future<void> saveLocalSettings(AppSettings settings) async {
    await _storage.write(
      key: settingsDarkModeKey,
      value: settings.darkMode.toString(),
    );
    await _storage.write(
      key: settingsScanRemindersKey,
      value: settings.scanReminders.toString(),
    );
    await _storage.write(
      key: settingsRecyclingTipsKey,
      value: settings.recyclingTips.toString(),
    );
  }

  @override
  Future<AppSettings> fetchRemoteSettings() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/api/users/settings',
      );
      final envelope = ApiResponse<Map<String, dynamic>>.fromJson(
        response.data ?? <String, dynamic>{},
        (dynamic data) => data as Map<String, dynamic>,
      );
      return AppSettingsDto.fromJson(envelope.data).toEntity();
    } on DioException catch (error) {
      throw mapDioException(error);
    }
  }

  @override
  Future<AppSettings> updateRemoteSettings({
    bool? darkMode,
    bool? scanReminders,
    bool? recyclingTips,
  }) async {
    try {
      final payload = <String, dynamic>{};
      if (darkMode != null) {
        payload['darkMode'] = darkMode;
      }
      if (scanReminders != null) {
        payload['scanReminders'] = scanReminders;
      }
      if (recyclingTips != null) {
        payload['recyclingTips'] = recyclingTips;
      }

      final response = await _dio.patch<Map<String, dynamic>>(
        '/api/users/settings',
        data: payload,
      );
      final envelope = ApiResponse<Map<String, dynamic>>.fromJson(
        response.data ?? <String, dynamic>{},
        (dynamic data) => data as Map<String, dynamic>,
      );
      return AppSettingsDto.fromJson(envelope.data).toEntity();
    } on DioException catch (error) {
      throw mapDioException(error);
    }
  }

  bool _parseBool(String? value, {required bool fallback}) {
    if (value == null) {
      return fallback;
    }

    return value.toLowerCase() == 'true';
  }
}

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../core/session/session_keys.dart';
import '../../domain/repositories/session_repository.dart';

final secureStorageProvider = Provider<FlutterSecureStorage>(
  (ref) => const FlutterSecureStorage(),
);

class SessionRepositoryImpl implements SessionRepository {
  SessionRepositoryImpl(this._storage);

  final FlutterSecureStorage _storage;

  @override
  Future<void> clear() async {
    await _storage.delete(key: sessionUserIdKey);
    await _storage.delete(key: sessionTokenKey);
  }

  @override
  Future<String?> getUserId() => _storage.read(key: sessionUserIdKey);

  @override
  Future<String?> getToken() => _storage.read(key: sessionTokenKey);

  @override
  Future<void> setUserId(String userId) =>
      _storage.write(key: sessionUserIdKey, value: userId);

  @override
  Future<void> setToken(String token) =>
      _storage.write(key: sessionTokenKey, value: token);

  @override
  Future<void> setSession(String userId, String token) async {
    await setUserId(userId);
    await setToken(token);
  }
}

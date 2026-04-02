import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/repository_providers.dart';

final sessionControllerProvider =
    AsyncNotifierProvider<SessionController, String?>(SessionController.new);

class SessionController extends AsyncNotifier<String?> {
  @override
  Future<String?> build() async {
    final repository = ref.read(sessionRepositoryProvider);
    return repository.getUserId();
  }

  Future<void> setUserId(String userId) async {
    final repository = ref.read(sessionRepositoryProvider);
    await repository.setUserId(userId);
    state = AsyncData(userId);
  }

  Future<void> setSession(String userId, String token) async {
    final repository = ref.read(sessionRepositoryProvider);
    await repository.setSession(userId, token);
    state = AsyncData(userId);
  }

  Future<String?> getToken() async {
    final repository = ref.read(sessionRepositoryProvider);
    return repository.getToken();
  }

  Future<void> clear() async {
    final repository = ref.read(sessionRepositoryProvider);
    await repository.clear();
    state = const AsyncData(null);
  }
}

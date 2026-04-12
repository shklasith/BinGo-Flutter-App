import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/repository_providers.dart';
import '../../domain/entities/app_user.dart';
import '../settings/settings_controller.dart';
import '../session/session_controller.dart';

final loginControllerProvider =
    AutoDisposeAsyncNotifierProvider<LoginController, AppUser?>(
      LoginController.new,
    );

final signupControllerProvider =
    AutoDisposeAsyncNotifierProvider<SignupController, AppUser?>(
      SignupController.new,
    );

class LoginController extends AutoDisposeAsyncNotifier<AppUser?> {
  @override
  Future<AppUser?> build() async => null;

  Future<AppUser> login(String email, String password) async {
    state = const AsyncLoading();
    final authRepository = ref.read(authRepositoryProvider);

    final user =
        await AsyncValue.guard(
          () => authRepository.login(email, password),
        ).then((AsyncValue<AppUser> value) {
          if (value.hasError) {
            throw value.error!;
          }
          return value.requireValue;
        });

    await ref
        .read(sessionControllerProvider.notifier)
        .setSession(user.id, user.token);
    ref.invalidate(settingsControllerProvider);
    state = AsyncData(user);
    return user;
  }
}

class SignupController extends AutoDisposeAsyncNotifier<AppUser?> {
  @override
  Future<AppUser?> build() async => null;

  Future<AppUser> signup(String username, String email, String password) async {
    state = const AsyncLoading();
    final authRepository = ref.read(authRepositoryProvider);

    final user =
        await AsyncValue.guard(
          () => authRepository.register(username, email, password),
        ).then((AsyncValue<AppUser> value) {
          if (value.hasError) {
            throw value.error!;
          }
          return value.requireValue;
        });

    await ref
        .read(sessionControllerProvider.notifier)
        .setSession(user.id, user.token);
    ref.invalidate(settingsControllerProvider);
    state = AsyncData(user);
    return user;
  }
}

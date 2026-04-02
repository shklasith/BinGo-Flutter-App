import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/repository_providers.dart';
import '../../domain/entities/app_user.dart';
import '../session/session_controller.dart';

final profileProvider = FutureProvider<AppUser>((ref) async {
  final userId = await ref.watch(sessionControllerProvider.future);
  if (userId == null || userId.isEmpty) {
    throw Exception('No user session found');
  }

  final repository = ref.watch(userRepositoryProvider);
  return repository.getProfile(userId);
});

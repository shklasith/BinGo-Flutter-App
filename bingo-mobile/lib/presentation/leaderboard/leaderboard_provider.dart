import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/repository_providers.dart';
import '../../domain/entities/leaderboard_entry.dart';

final leaderboardProvider = FutureProvider<List<LeaderboardEntry>>((ref) {
  final repository = ref.watch(leaderboardRepositoryProvider);
  return repository.getTopUsers();
});

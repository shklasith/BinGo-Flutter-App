import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/repository_providers.dart';
import '../../domain/entities/daily_tip.dart';

final dailyTipProvider = FutureProvider<DailyTip>((ref) {
  final repository = ref.watch(educationRepositoryProvider);
  return repository.getDailyTip();
});

final tipSearchQueryProvider = StateProvider<String>((ref) => '');

final tipSearchProvider = FutureProvider<List<DailyTip>>((ref) async {
  final query = ref.watch(tipSearchQueryProvider).trim();
  if (query.isEmpty) {
    return <DailyTip>[];
  }

  final repository = ref.watch(educationRepositoryProvider);
  return repository.searchTips(query);
});

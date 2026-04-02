import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/repository_providers.dart';
import '../../domain/entities/recycling_center.dart';

final centersControllerProvider =
    AutoDisposeAsyncNotifierProvider<CentersController, List<RecyclingCenter>>(
      CentersController.new,
    );

class CentersController
    extends AutoDisposeAsyncNotifier<List<RecyclingCenter>> {
  @override
  Future<List<RecyclingCenter>> build() async => <RecyclingCenter>[];

  Future<void> loadNearby(double lat, double lng, {int radius = 5000}) async {
    state = const AsyncLoading();
    final repository = ref.read(centerRepositoryProvider);
    state = await AsyncValue.guard(
      () => repository.getNearby(lat, lng, radius),
    );
  }
}

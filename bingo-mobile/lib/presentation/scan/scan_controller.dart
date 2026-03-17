import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/repository_providers.dart';
import '../../domain/entities/scan_result.dart';

final scanControllerProvider =
    AutoDisposeAsyncNotifierProvider<ScanController, ScanResult?>(
      ScanController.new,
    );

class ScanController extends AutoDisposeAsyncNotifier<ScanResult?> {
  @override
  Future<ScanResult?> build() async => null;

  Future<ScanResult> submit(File imageFile) async {
    state = const AsyncLoading();
    final repository = ref.read(scanRepositoryProvider);

    final result =
        await AsyncValue.guard(
          () => repository.scanImage(imageFile),
        ).then((AsyncValue<ScanResult> value) {
          if (value.hasError) {
            throw value.error!;
          }
          return value.requireValue;
        });

    state = AsyncData(result);
    return result;
  }
}

import 'dart:io';

import '../../core/network/api_client.dart';
import 'domain/scan_result.dart';

class ScanController {
  ScanController({ApiClient? apiClient})
    : _apiClient = apiClient ?? ApiClient();

  final ApiClient _apiClient;

  Future<ScanResult> submit(File imageFile) async {
    final data = await _apiClient.multipartPost(
      '/api/scan',
      file: imageFile,
      fieldName: 'image',
      includeTokenIfAvailable: true,
    );

    return ScanResult.fromJson(data);
  }
}

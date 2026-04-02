import 'dart:io';

import 'package:dio/dio.dart';

import '../../core/network/api_response.dart';
import '../../core/network/dio_client.dart';
import '../../domain/entities/scan_result.dart';
import '../../domain/repositories/scan_repository.dart';
import '../models/scan_result_dto.dart';

class ScanRepositoryImpl implements ScanRepository {
  ScanRepositoryImpl(this._dio);

  final Dio _dio;

  @override
  Future<ScanResult> scanImage(File file) async {
    try {
      final fileName = file.path.split('/').last;
      final formData = FormData.fromMap(<String, dynamic>{
        'image': await MultipartFile.fromFile(file.path, filename: fileName),
      });

      final response = await _dio.post<Map<String, dynamic>>(
        '/api/scan',
        data: formData,
        options: Options(
          headers: <String, String>{'Content-Type': 'multipart/form-data'},
        ),
      );

      final envelope = ApiResponse<Map<String, dynamic>>.fromJson(
        response.data ?? <String, dynamic>{},
        (dynamic data) => data as Map<String, dynamic>,
      );
      return ScanResultDto.fromJson(envelope.data).toEntity();
    } on DioException catch (error) {
      throw mapDioException(error);
    }
  }
}

import 'package:dio/dio.dart';

import '../../core/network/api_response.dart';
import '../../core/network/dio_client.dart';
import '../../domain/entities/daily_tip.dart';
import '../../domain/repositories/education_repository.dart';
import '../models/daily_tip_dto.dart';

class EducationRepositoryImpl implements EducationRepository {
  EducationRepositoryImpl(this._dio);

  final Dio _dio;

  @override
  Future<DailyTip> getDailyTip() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/api/education/daily-tip',
      );
      final envelope = ApiResponse<Map<String, dynamic>>.fromJson(
        response.data ?? <String, dynamic>{},
        (dynamic data) => data as Map<String, dynamic>,
      );
      return DailyTipDto.fromJson(envelope.data).toEntity();
    } on DioException catch (error) {
      throw mapDioException(error);
    }
  }

  @override
  Future<List<DailyTip>> searchTips(String query) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/api/education/search',
        queryParameters: <String, dynamic>{'q': query},
      );
      final envelope = ApiResponse<List<dynamic>>.fromJson(
        response.data ?? <String, dynamic>{},
        (dynamic data) => data as List<dynamic>,
      );
      return envelope.data
          .map(
            (dynamic item) =>
                DailyTipDto.fromJson(item as Map<String, dynamic>).toEntity(),
          )
          .toList();
    } on DioException catch (error) {
      throw mapDioException(error);
    }
  }
}

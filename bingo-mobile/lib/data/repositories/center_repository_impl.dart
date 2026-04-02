import 'package:dio/dio.dart';

import '../../core/network/api_response.dart';
import '../../core/network/dio_client.dart';
import '../../domain/entities/recycling_center.dart';
import '../../domain/repositories/center_repository.dart';
import '../models/recycling_center_dto.dart';

class CenterRepositoryImpl implements CenterRepository {
  CenterRepositoryImpl(this._dio);

  final Dio _dio;

  @override
  Future<List<RecyclingCenter>> getNearby(
    double lat,
    double lng,
    int radius,
  ) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/api/centers/nearby',
        queryParameters: <String, dynamic>{
          'lat': lat,
          'lng': lng,
          'radius': radius,
        },
      );

      final envelope = ApiResponse<List<dynamic>>.fromJson(
        response.data ?? <String, dynamic>{},
        (dynamic data) => data as List<dynamic>,
      );

      return envelope.data
          .map(
            (dynamic item) => RecyclingCenterDto.fromJson(
              item as Map<String, dynamic>,
            ).toEntity(),
          )
          .toList();
    } on DioException catch (error) {
      throw mapDioException(error);
    }
  }
}

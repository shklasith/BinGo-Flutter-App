import 'package:dio/dio.dart';

import '../../core/network/api_response.dart';
import '../../core/network/dio_client.dart';
import '../../domain/entities/leaderboard_entry.dart';
import '../../domain/repositories/leaderboard_repository.dart';
import '../models/leaderboard_entry_dto.dart';

class LeaderboardRepositoryImpl implements LeaderboardRepository {
  LeaderboardRepositoryImpl(this._dio);

  final Dio _dio;

  @override
  Future<List<LeaderboardEntry>> getTopUsers() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/api/users/leaderboard',
      );
      final envelope = ApiResponse<List<dynamic>>.fromJson(
        response.data ?? <String, dynamic>{},
        (dynamic data) => data as List<dynamic>,
      );

      return envelope.data
          .map(
            (dynamic item) => LeaderboardEntryDto.fromJson(
              item as Map<String, dynamic>,
            ).toEntity(),
          )
          .toList();
    } on DioException catch (error) {
      throw mapDioException(error);
    }
  }
}

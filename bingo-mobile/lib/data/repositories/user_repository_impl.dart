import 'package:dio/dio.dart';

import '../../core/network/api_response.dart';
import '../../core/network/dio_client.dart';
import '../../domain/entities/app_user.dart';
import '../../domain/repositories/user_repository.dart';
import '../models/app_user_dto.dart';

class UserRepositoryImpl implements UserRepository {
  UserRepositoryImpl(this._dio);

  final Dio _dio;

  @override
  Future<AppUser> getProfile(String userId) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/api/users/$userId',
      );
      final envelope = ApiResponse<Map<String, dynamic>>.fromJson(
        response.data ?? <String, dynamic>{},
        (dynamic data) => data as Map<String, dynamic>,
      );
      return AppUserDto.fromJson(envelope.data).toEntity();
    } on DioException catch (error) {
      throw mapDioException(error);
    }
  }
}

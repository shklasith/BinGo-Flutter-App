import 'package:dio/dio.dart';

import '../../core/network/api_response.dart';
import '../../core/network/dio_client.dart';
import '../../domain/entities/app_user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../models/app_user_dto.dart';

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl(this._dio);

  final Dio _dio;

  @override
  Future<AppUser> register(
    String username,
    String email,
    String password,
  ) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/api/users/register',
        data: <String, dynamic>{
          'username': username,
          'email': email,
          'password': password,
        },
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

  @override
  Future<AppUser> login(String email, String password) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/api/users/login',
        data: <String, dynamic>{'email': email, 'password': password},
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

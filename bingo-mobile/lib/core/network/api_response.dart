import '../errors/api_exception.dart';

class ApiResponse<T> {
  const ApiResponse({
    required this.success,
    required this.data,
    this.message,
    this.count,
  });

  final bool success;
  final T data;
  final String? message;
  final int? count;

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic data) parser,
  ) {
    final success = json['success'] == true;
    if (!success) {
      throw ApiException(json['message']?.toString() ?? 'Request failed');
    }

    return ApiResponse<T>(
      success: success,
      data: parser(json['data']),
      message: json['message']?.toString(),
      count: json['count'] as int?,
    );
  }
}

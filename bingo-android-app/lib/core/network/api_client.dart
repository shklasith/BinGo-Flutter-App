import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../../features/session/session_store.dart';
import '../env/app_env.dart';

class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class ApiClient {
  ApiClient({http.Client? client, SessionStore? sessionStore})
    : _client = client ?? http.Client(),
      _sessionStore = sessionStore ?? SessionStore();

  final http.Client _client;
  final SessionStore _sessionStore;

  Uri _uri(String path, [Map<String, dynamic>? queryParameters]) {
    final base = Uri.parse(AppEnv.apiBaseUrl);
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    final query = queryParameters?.map(
      (key, value) => MapEntry(key, value.toString()),
    );
    final basePath = base.path;

    return base.replace(
      path: '$basePath$normalizedPath'.replaceAll('//', '/'),
      queryParameters: query,
    );
  }

  Future<Map<String, dynamic>> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    bool authenticated = false,
  }) async {
    final response = await _client.get(
      _uri(path, queryParameters),
      headers: await _headers(authenticated: authenticated),
    );
    return _decodeEnvelope(response);
  }

  Future<Map<String, dynamic>> post(
    String path, {
    Map<String, dynamic>? body,
    bool authenticated = false,
  }) async {
    final response = await _client.post(
      _uri(path),
      headers: await _headers(authenticated: authenticated),
      body: jsonEncode(body ?? <String, dynamic>{}),
    );
    return _decodeEnvelope(response);
  }

  Future<Map<String, dynamic>> multipartPost(
    String path, {
    required File file,
    required String fieldName,
    bool authenticated = false,
    bool includeTokenIfAvailable = false,
  }) async {
    final request = http.MultipartRequest('POST', _uri(path));
    request.files.add(await http.MultipartFile.fromPath(fieldName, file.path));
    request.headers.addAll(
      await _headers(
        authenticated: authenticated,
        includeTokenIfAvailable: includeTokenIfAvailable,
        json: false,
      ),
    );

    final streamed = await request.send();
    final response = await http.Response.fromStream(streamed);
    return _decodeEnvelope(response);
  }

  Future<Map<String, String>> _headers({
    required bool authenticated,
    bool includeTokenIfAvailable = false,
    bool json = true,
  }) async {
    final headers = <String, String>{};
    if (json) {
      headers['Content-Type'] = 'application/json';
    }

    if (authenticated) {
      final token = await _sessionStore.getToken();
      if (token == null || token.isEmpty) {
        throw const ApiException('No active session. Please log in again.');
      }
      headers['Authorization'] = 'Bearer $token';
    } else if (includeTokenIfAvailable) {
      final token = await _sessionStore.getToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  Map<String, dynamic> _decodeEnvelope(http.Response response) {
    final decoded = response.body.isEmpty
        ? <String, dynamic>{}
        : jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(
        decoded['message']?.toString() ?? 'Request failed',
        statusCode: response.statusCode,
      );
    }

    if (decoded['success'] == false) {
      throw ApiException(decoded['message']?.toString() ?? 'Request failed');
    }

    final data = decoded['data'];
    if (data is Map<String, dynamic>) {
      return data;
    }

    return <String, dynamic>{'data': data};
  }
}

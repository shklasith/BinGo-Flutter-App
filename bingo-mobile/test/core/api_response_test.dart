import 'package:bingo_mobile/core/errors/api_exception.dart';
import 'package:bingo_mobile/core/network/api_response.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ApiResponse', () {
    test('parses successful envelope', () {
      final response = ApiResponse<Map<String, dynamic>>.fromJson(
        <String, dynamic>{
          'success': true,
          'data': <String, dynamic>{'name': 'test'},
          'message': 'ok',
        },
        (dynamic data) => data as Map<String, dynamic>,
      );

      expect(response.success, isTrue);
      expect(response.data['name'], 'test');
      expect(response.message, 'ok');
    });

    test('throws ApiException when success is false', () {
      expect(
        () => ApiResponse<Map<String, dynamic>>.fromJson(<String, dynamic>{
          'success': false,
          'message': 'bad request',
        }, (dynamic data) => data as Map<String, dynamic>),
        throwsA(isA<ApiException>()),
      );
    });
  });
}

import 'package:bingo_mobile/data/models/app_user_dto.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('AppUserDto maps backend payload correctly', () {
    final dto = AppUserDto.fromJson(<String, dynamic>{
      '_id': 'abc123',
      'username': 'eco',
      'email': 'eco@example.com',
      'points': 42,
      'badges': <String>['starter'],
      'impactStats': <String, dynamic>{
        'treesSaved': 1,
        'plasticDiverted': 2,
        'co2Reduced': 0.7,
      },
    });

    final entity = dto.toEntity();

    expect(entity.id, 'abc123');
    expect(entity.username, 'eco');
    expect(entity.points, 42);
    expect(entity.impactStats.treesSaved, 1);
  });
}

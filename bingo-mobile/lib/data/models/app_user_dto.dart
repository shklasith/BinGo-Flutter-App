import '../../domain/entities/app_user.dart';
import 'impact_stats_dto.dart';

class AppUserDto {
  const AppUserDto({
    required this.id,
    required this.username,
    required this.email,
    required this.token,
    required this.points,
    required this.badges,
    required this.impactStats,
  });

  final String id;
  final String username;
  final String email;
  final String token;
  final int points;
  final List<String> badges;
  final ImpactStatsDto impactStats;

  factory AppUserDto.fromJson(Map<String, dynamic> json) {
    return AppUserDto(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      username: (json['username'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
      token: (json['token'] ?? '').toString(),
      points: (json['points'] as num? ?? 0).toInt(),
      badges: (json['badges'] as List<dynamic>? ?? <dynamic>[])
          .map((dynamic item) => item.toString())
          .toList(),
      impactStats: ImpactStatsDto.fromJson(
        (json['impactStats'] as Map<String, dynamic>? ?? <String, dynamic>{}),
      ),
    );
  }

  AppUser toEntity() => AppUser(
    id: id,
    username: username,
    email: email,
    token: token,
    points: points,
    badges: badges,
    impactStats: impactStats.toEntity(),
  );
}

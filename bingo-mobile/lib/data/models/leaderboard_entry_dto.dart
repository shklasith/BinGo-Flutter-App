import '../../domain/entities/leaderboard_entry.dart';
import 'impact_stats_dto.dart';

class LeaderboardEntryDto {
  const LeaderboardEntryDto({
    required this.username,
    required this.points,
    required this.badges,
    required this.impactStats,
  });

  final String username;
  final int points;
  final List<String> badges;
  final ImpactStatsDto impactStats;

  factory LeaderboardEntryDto.fromJson(Map<String, dynamic> json) {
    return LeaderboardEntryDto(
      username: (json['username'] ?? '').toString(),
      points: (json['points'] as num? ?? 0).toInt(),
      badges: (json['badges'] as List<dynamic>? ?? <dynamic>[])
          .map((dynamic item) => item.toString())
          .toList(),
      impactStats: ImpactStatsDto.fromJson(
        (json['impactStats'] as Map<String, dynamic>? ?? <String, dynamic>{}),
      ),
    );
  }

  LeaderboardEntry toEntity() => LeaderboardEntry(
    username: username,
    points: points,
    badges: badges,
    impactStats: impactStats.toEntity(),
  );
}

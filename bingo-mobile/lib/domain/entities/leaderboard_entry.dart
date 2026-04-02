import 'impact_stats.dart';

class LeaderboardEntry {
  const LeaderboardEntry({
    required this.username,
    required this.points,
    required this.badges,
    required this.impactStats,
  });

  final String username;
  final int points;
  final List<String> badges;
  final ImpactStats impactStats;
}

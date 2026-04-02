import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/entities/leaderboard_entry.dart';
import '../shared/app_scaffold.dart';
import '../shared/app_theme.dart';
import 'leaderboard_provider.dart';

class LeaderboardScreen extends ConsumerWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final leaderboardAsync = ref.watch(leaderboardProvider);

    return AppScaffold(
      currentIndex: 2,
      body: leaderboardAsync.when(
        data: (users) {
          if (users.isEmpty) {
            return const Center(child: Text('No leaderboard data found.'));
          }
          return ListView(
            padding: EdgeInsets.zero,
            children: <Widget>[
              Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: <Color>[AppTheme.primary, Color(0xFF16A34A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.vertical(
                    bottom: Radius.circular(36),
                  ),
                ),
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 30),
                child: Column(
                  children: <Widget>[
                    const Text(
                      'Leaderboard',
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Top recyclers in your area',
                      style: TextStyle(color: Color(0xFFD1FAE5)),
                    ),
                    const SizedBox(height: 22),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: <Widget>[
                        _podium('2', '3.9k', 94, const Color(0xFFD1D5DB)),
                        const SizedBox(width: 10),
                        _podium('1', '4.2k', 122, const Color(0xFFFACC15)),
                        const SizedBox(width: 10),
                        _podium('3', '3.1k', 78, const Color(0xFFD97706)),
                      ],
                    ),
                  ],
                ),
              ),
              Transform.translate(
                offset: const Offset(0, -20),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: const <BoxShadow>[
                      BoxShadow(
                        color: Color(0x14000000),
                        blurRadius: 14,
                        offset: Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: users
                        .asMap()
                        .entries
                        .map(
                          (entry) => _rankRow(
                            user: entry.value,
                            rank: entry.key + 1,
                            last: entry.key == users.length - 1,
                          ),
                        )
                        .toList(),
                  ),
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (Object error, StackTrace stackTrace) =>
            Center(child: Text('Failed to load leaderboard: $error')),
      ),
    );
  }

  Widget _podium(String rank, String points, double height, Color borderColor) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Container(
          width: rank == '1' ? 62 : 48,
          height: rank == '1' ? 62 : 48,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white,
            border: Border.all(color: borderColor, width: 4),
          ),
          child: Center(
            child: rank == '1'
                ? const Icon(
                    Icons.emoji_events,
                    color: Color(0xFFEAB308),
                    size: 28,
                  )
                : Text(
                    rank,
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      color: borderColor == const Color(0xFFD1D5DB)
                          ? const Color(0xFF6B7280)
                          : const Color(0xFF92400E),
                    ),
                  ),
          ),
        ),
        Container(
          width: 78,
          height: height,
          margin: const EdgeInsets.only(top: 8),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: rank == '1' ? 0.35 : 0.2),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            border: Border.all(color: Colors.white.withValues(alpha: 0.35)),
          ),
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom: 8),
          child: Text(
            points,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ],
    );
  }

  Widget _rankRow({
    required LeaderboardEntry user,
    required int rank,
    required bool last,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        border: last
            ? null
            : const Border(bottom: BorderSide(color: Color(0xFFF3F4F6))),
      ),
      child: Row(
        children: <Widget>[
          SizedBox(
            width: 26,
            child: Text(
              '$rank',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: rank <= 3 ? AppTheme.text : const Color(0xFF9CA3AF),
              ),
            ),
          ),
          const SizedBox(width: 10),
          CircleAvatar(
            radius: 20,
            backgroundColor: rank == 1
                ? const Color(0xFFFEF3C7)
                : const Color(0xFFF3F4F6),
            child: Text(
              user.username.isEmpty ? '?' : user.username[0].toUpperCase(),
              style: TextStyle(
                fontWeight: FontWeight.w700,
                color: rank == 1
                    ? const Color(0xFFB45309)
                    : const Color(0xFF6B7280),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              user.username,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
          Text(
            '${user.points} pts',
            style: const TextStyle(
              color: AppTheme.primary,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

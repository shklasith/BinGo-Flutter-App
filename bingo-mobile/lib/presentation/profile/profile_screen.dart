import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../domain/entities/app_user.dart';
import '../session/session_controller.dart';
import '../shared/app_scaffold.dart';
import '../shared/app_theme.dart';
import 'profile_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(profileProvider);

    return AppScaffold(
      currentIndex: 3,
      body: profileAsync.when(
        data: (user) => _ProfileView(user: user, ref: ref),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (Object error, StackTrace stackTrace) =>
            Center(child: Text('Failed to load profile: $error')),
      ),
    );
  }
}

class _ProfileView extends StatelessWidget {
  const _ProfileView({required this.user, required this.ref});

  final AppUser user;
  final WidgetRef ref;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
      children: <Widget>[
        Row(
          children: const <Widget>[
            Text(
              'Profile',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800),
            ),
            Spacer(),
            Icon(Icons.settings_outlined, color: AppTheme.muted),
          ],
        ),
        const SizedBox(height: 20),
        Row(
          children: <Widget>[
            Container(
              width: 92,
              height: 92,
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.12),
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 4),
              ),
              child: const Icon(
                Icons.eco_outlined,
                color: AppTheme.primary,
                size: 42,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    user.username,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    'Joined Feb 2026',
                    style: TextStyle(color: AppTheme.muted),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        Icon(Icons.emoji_events_outlined, size: 14),
                        SizedBox(width: 4),
                        Text(
                          'Level 4 Recycler',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 22),
        const Text(
          'Overall Impact',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 12),
        Row(
          children: <Widget>[
            Expanded(
              child: _MetricTile(
                icon: Icons.bar_chart_rounded,
                iconBg: const Color(0xFFEFF6FF),
                iconColor: const Color(0xFF3B82F6),
                value: '${user.points ~/ 10}',
                label: 'Items Scanned',
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: _MetricTile(
                icon: Icons.check_circle_outline,
                iconBg: Color(0xFFF0FDF4),
                iconColor: Color(0xFF22C55E),
                value: '92%',
                label: 'Sorting Accuracy',
              ),
            ),
          ],
        ),
        const SizedBox(height: 18),
        const Text(
          'Badges Earned',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 124,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: user.badges.isEmpty ? 3 : user.badges.length,
            itemBuilder: (BuildContext context, int index) {
              final badge = user.badges.isEmpty
                  ? <String>[
                      'Glass Guardian',
                      'Plastic Hero',
                      'Compost Pro',
                    ][index]
                  : user.badges[index];
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: SizedBox(
                  width: 86,
                  child: Column(
                    children: <Widget>[
                      Container(
                        width: 74,
                        height: 74,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppTheme.primary.withValues(alpha: 0.2),
                            width: 4,
                          ),
                        ),
                        child: const Icon(
                          Icons.military_tech_outlined,
                          color: AppTheme.primary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        badge,
                        maxLines: 2,
                        textAlign: TextAlign.center,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF374151),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          onPressed: () {},
          icon: const Icon(Icons.history),
          label: const Text('View Full Scan History'),
        ),
        const SizedBox(height: 10),
        OutlinedButton.icon(
          onPressed: () async {
            await ref.read(sessionControllerProvider.notifier).clear();
            if (context.mounted) {
              context.go('/login');
            }
          },
          icon: const Icon(Icons.logout),
          label: const Text('Log Out'),
        ),
      ],
    );
  }
}

class _MetricTile extends StatelessWidget {
  const _MetricTile({
    required this.icon,
    required this.iconBg,
    required this.iconColor,
    required this.value,
    required this.label,
  });

  final IconData icon;
  final Color iconBg;
  final Color iconColor;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF3F4F6)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
            child: Icon(icon, size: 22, color: iconColor),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 24),
          ),
          Text(
            label,
            style: const TextStyle(color: AppTheme.muted, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

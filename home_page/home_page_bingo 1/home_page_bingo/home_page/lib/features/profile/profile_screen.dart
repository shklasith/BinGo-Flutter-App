import 'package:flutter/material.dart';

import '../../shared/app_scaffold.dart';
import '../../shared/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      currentIndex: 3,
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
        children: <Widget>[
          // Avatar + name
          Center(
            child: Column(
              children: <Widget>[
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.person, size: 44, color: AppTheme.primary),
                ),
                const SizedBox(height: 12),
                const Text('Bingo', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
                const SizedBox(height: 4),
                const Text('eco.warrior@email.com', style: TextStyle(color: AppTheme.muted)),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Stats row
          Row(
            children: const <Widget>[
              _StatBox(label: 'Points', value: '4,250'),
              SizedBox(width: 12),
              _StatBox(label: 'Plastic', value: '12 kg'),
              SizedBox(width: 12),
              _StatBox(label: 'CO2', value: '5.2 kg'),
            ],
          ),
          const SizedBox(height: 24),

          // Menu items
          ...<_MenuItem>[
            const _MenuItem(icon: Icons.history,         label: 'Activity History'),
            const _MenuItem(icon: Icons.emoji_events,    label: 'Achievements'),
            const _MenuItem(icon: Icons.notifications_outlined, label: 'Notifications'),
            const _MenuItem(icon: Icons.settings_outlined, label: 'Settings'),
            const _MenuItem(icon: Icons.logout,          label: 'Sign Out', isDestructive: true),
          ].map((m) => _MenuTile(item: m)),
        ],
      ),
    );
  }
}

class _StatBox extends StatelessWidget {
  const _StatBox({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFF3F4F6)),
        ),
        child: Column(
          children: <Widget>[
            Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.muted)),
          ],
        ),
      ),
    );
  }
}

class _MenuItem {
  const _MenuItem({required this.icon, required this.label, this.isDestructive = false});
  final IconData icon;
  final String   label;
  final bool     isDestructive;
}

class _MenuTile extends StatelessWidget {
  const _MenuTile({required this.item});

  final _MenuItem item;

  @override
  Widget build(BuildContext context) {
    final Color color = item.isDestructive ? Colors.red : const Color(0xFF111827);
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFF3F4F6)),
      ),
      child: ListTile(
        leading: Icon(item.icon, color: color),
        title: Text(item.label, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
        trailing: item.isDestructive ? null : const Icon(Icons.chevron_right, color: AppTheme.muted),
        onTap: () {},
      ),
    );
  }
}
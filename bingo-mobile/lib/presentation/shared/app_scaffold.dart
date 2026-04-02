import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'app_theme.dart';

class AppScaffold extends StatelessWidget {
  const AppScaffold({
    required this.currentIndex,
    required this.body,
    this.title,
    this.floatingActionButton,
    super.key,
  });

  final String? title;
  final int currentIndex;
  final Widget body;
  final Widget? floatingActionButton;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bg,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 430),
            child: Container(
              color: Colors.white,
              child: Stack(
                children: <Widget>[
                  Positioned.fill(
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 76),
                      child: body,
                    ),
                  ),
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: _BottomNav(currentIndex: currentIndex),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      floatingActionButton: floatingActionButton,
    );
  }
}

class _BottomNav extends StatelessWidget {
  const _BottomNav({required this.currentIndex});

  final int currentIndex;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 74,
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: Color(0x12000000),
            blurRadius: 10,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: <Widget>[
          Expanded(
            child: _NavItem(
              active: currentIndex == 0,
              icon: Icons.home_outlined,
              label: 'Home',
              onTap: () => context.go('/home'),
            ),
          ),
          Expanded(
            child: _NavItem(
              active: currentIndex == 1,
              icon: Icons.map_outlined,
              label: 'Map',
              onTap: () => context.go('/centers'),
            ),
          ),
          Expanded(
            child: Center(
              child: Transform.translate(
                offset: const Offset(0, -16),
                child: GestureDetector(
                  onTap: () => context.go('/scan'),
                  child: Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      shape: BoxShape.circle,
                      boxShadow: const <BoxShadow>[
                        BoxShadow(
                          color: Color(0x4410B981),
                          blurRadius: 16,
                          offset: Offset(0, 6),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.camera_alt_outlined,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: _NavItem(
              active: currentIndex == 2,
              icon: Icons.emoji_events_outlined,
              label: 'Leader',
              onTap: () => context.go('/leaderboard'),
            ),
          ),
          Expanded(
            child: _NavItem(
              active: currentIndex == 3,
              icon: Icons.person_outline,
              label: 'Profile',
              onTap: () => context.go('/profile'),
            ),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.active,
    required this.icon,
    required this.label,
    required this.onTap,
  });

  final bool active;
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = active ? AppTheme.primary : const Color(0xFF9CA3AF);
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

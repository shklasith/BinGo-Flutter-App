import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'app_theme.dart';

class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.body,
    required this.currentIndex,
  });

  final Widget body;
  final int currentIndex;

  static const List<_NavItem> _items = <_NavItem>[
    _NavItem(icon: Icons.home_outlined,       label: 'Home',    route: '/'),
    _NavItem(icon: Icons.map_outlined,         label: 'Centers', route: '/centers'),
    _NavItem(icon: Icons.menu_book_outlined,   label: 'Guide',   route: '/guide'),
    _NavItem(icon: Icons.person_outline,       label: 'Profile', route: '/profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: body),
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        indicatorColor: AppTheme.primary.withValues(alpha: 0.15),
        onDestinationSelected: (int i) => context.go(_items[i].route),
        destinations: _items
            .map(
              (item) => NavigationDestination(
                icon:          Icon(item.icon),
                selectedIcon:  Icon(item.icon, color: AppTheme.primary),
                label:         item.label,
              ),
            )
            .toList(),
      ),
    );
  }
}

class _NavItem {
  const _NavItem({
    required this.icon,
    required this.label,
    required this.route,
  });

  final IconData icon;
  final String   label;
  final String   route;
}

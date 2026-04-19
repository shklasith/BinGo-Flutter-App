import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'shared/app_theme.dart';
import 'features/home/home_screen.dart';
import 'features/centers/centers_screen.dart';
import 'features/guide/guide_screen.dart';
import 'features/profile/profile_screen.dart';

final GoRouter _router = GoRouter(
  initialLocation: '/',
  routes: <RouteBase>[
    GoRoute(path: '/',          builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/centers',   builder: (_, __) => const CentersScreen()),
    GoRoute(path: '/guide',     builder: (_, __) => const GuideScreen()),
    GoRoute(path: '/profile',   builder: (_, __) => const ProfileScreen()),
  ],
);

class EcoApp extends StatelessWidget {
  const EcoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'EcoWarrior',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.themeData,
      routerConfig: _router,
    );
  }
}

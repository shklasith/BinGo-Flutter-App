import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../domain/entities/scan_result.dart';
import '../presentation/auth/login_screen.dart';
import '../presentation/auth/signup_screen.dart';
import '../presentation/centers/centers_screen.dart';
import '../presentation/home/home_screen.dart';
import '../presentation/leaderboard/leaderboard_screen.dart';
import '../presentation/profile/profile_screen.dart';
import '../presentation/scan/scan_result_screen.dart';
import '../presentation/scan/scan_screen.dart';
import '../presentation/session/splash_screen.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: <RouteBase>[
      GoRoute(
        path: '/',
        builder: (BuildContext context, GoRouterState state) =>
            const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (BuildContext context, GoRouterState state) =>
            const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (BuildContext context, GoRouterState state) =>
            const SignupScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (BuildContext context, GoRouterState state) =>
            const HomeScreen(),
      ),
      GoRoute(
        path: '/scan',
        builder: (BuildContext context, GoRouterState state) =>
            const ScanScreen(),
      ),
      GoRoute(
        path: '/scan-result',
        builder: (BuildContext context, GoRouterState state) {
          final payload = state.extra as Map<String, dynamic>?;
          final result = payload?['result'] as ScanResult?;
          final imagePath = payload?['imagePath'] as String?;

          if (result == null || imagePath == null) {
            return const _RouteErrorScreen(
              message: 'Scan result payload missing.',
            );
          }

          return ScanResultScreen(result: result, imagePath: imagePath);
        },
      ),
      GoRoute(
        path: '/centers',
        builder: (BuildContext context, GoRouterState state) =>
            const CentersScreen(),
      ),
      GoRoute(
        path: '/leaderboard',
        builder: (BuildContext context, GoRouterState state) =>
            const LeaderboardScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (BuildContext context, GoRouterState state) =>
            const ProfileScreen(),
      ),
    ],
  );
});

class _RouteErrorScreen extends StatelessWidget {
  const _RouteErrorScreen({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: Text(message)));
  }
}

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// 🔥 Import Nav Shell
import '../shared/bottom_nav_shell.dart';

// 🔥 Import Screens
import '../presentation/profile/profile_screen.dart';


// 👉 Temporary screens (replace later)
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text("Home Screen"));
  }
}

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text("Leaderboard Screen"));
  }
}

class ScanScreen extends StatelessWidget {
  const ScanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text("Camera Screen")),
    );
  }
}

class CentersScreen extends StatelessWidget {
  const CentersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text("Centers Screen")),
    );
  }
}

// ─────────────────────────────────────────
// ✅ ROUTER
// ─────────────────────────────────────────

final GoRouter router = GoRouter(
  initialLocation: '/profile',

  routes: [

    // 🔥 NAVIGATION WRAPPER
    ShellRoute(
      builder: (context, state, child) {
        return BottomNavShell(child: child);
      },
      routes: [

        // 🏠 Home
        GoRoute(
          path: '/home',
          builder: (context, state) => const HomeScreen(),
        ),

        // 🏆 Leaderboard
        GoRoute(
          path: '/leaderboard',
          builder: (context, state) => const LeaderboardScreen(),
        ),

        // 📍 Centers
        GoRoute(
          path: '/center',
          builder: (context, state) => const CentersScreen(),
        ),

        // 👤 Profile
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
      ],
    ),

    // 📷 Camera (NO NAVBAR)
    GoRoute(
      path: '/scan',
      builder: (context, state) => const ScanScreen(),
    ),
  ],
);
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class BottomNavShell extends StatelessWidget {
  final Widget child;

  const BottomNavShell({super.key, required this.child});

  // 🔥 Detect current tab from route
  int _getIndex(String location) {
    if (location.startsWith('/home')) return 0;
    if (location.startsWith('/leaderboard')) return 1;
    if (location.startsWith('/center')) return 3;
    if (location.startsWith('/profile')) return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final location =
        GoRouter.of(context).routeInformationProvider.value.location;

    final currentIndex = _getIndex(location);

    return Scaffold(
      body: child,

      // 📷 CENTER CAMERA BUTTON
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/scan'),
        backgroundColor: Colors.green,
        elevation: 6,
        child: const Icon(Icons.camera_alt, size: 28),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,

      // 🔥 BOTTOM NAV BAR
      bottomNavigationBar: SafeArea(
        child: BottomAppBar(
          shape: const CircularNotchedRectangle(),
          notchMargin: 8,
          child: SizedBox(
            height: 65,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [

                _navItem(context, Icons.home, 0, "Home", currentIndex),
                _navItem(context, Icons.emoji_events, 1, "Leaderboard", currentIndex),

                const SizedBox(width: 40), // space for FAB

                _navItem(context, Icons.location_on, 3, "Centers", currentIndex),
                _navItem(context, Icons.person, 4, "Profile", currentIndex),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // 🔹 Nav Item Widget
  Widget _navItem(
    BuildContext context,
    IconData icon,
    int index,
    String label,
    int currentIndex,
  ) {
    final routes = [
      '/home',
      '/leaderboard',
      '/scan',
      '/center',
      '/profile',
    ];

    final isSelected = currentIndex == index;

    return GestureDetector(
      onTap: () => context.go(routes[index]),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isSelected ? Colors.green : Colors.grey,
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: isSelected ? Colors.green : Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}
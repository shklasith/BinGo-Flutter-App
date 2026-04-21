import 'package:flutter/material.dart';

class AppScaffold extends StatelessWidget {

  final Widget body;
  final int currentIndex;

  const AppScaffold({
    super.key,
    required this.body,
    required this.currentIndex,
  });

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body: SafeArea(child: body),
      backgroundColor: const Color.fromARGB(255, 228, 248, 230),

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        items: const [

          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Home",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.qr_code_scanner),
            label: "Scan",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.leaderboard),
            label: "Leaderboard",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: "Profile",
          ),

        ],
      ),
    );
  }
}
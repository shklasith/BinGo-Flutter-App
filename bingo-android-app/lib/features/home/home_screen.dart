import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../session/session_store.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: FutureBuilder<bool>(
        future: SessionStore().hasSession(),
        builder: (context, snapshot) {
          final isSignedIn = snapshot.data ?? false;

          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              _HeroPanel(isSignedIn: isSignedIn),
              const SizedBox(height: 18),
              _FeatureCard(
                icon: Icons.camera_alt_outlined,
                title: 'Scan Materials',
                description: isSignedIn
                    ? 'Classify waste and add earned points to your profile.'
                    : 'Classify waste instantly. Sign in when you want to save points.',
                buttonLabel: 'Open Scan',
                onTap: () => context.go('/scan'),
              ),
              const SizedBox(height: 14),
              _FeatureCard(
                icon: Icons.location_on_outlined,
                title: 'Find Recycling Centers',
                description:
                    'Locate nearby places to recycle sorted materials.',
                buttonLabel: 'Open Centers',
                onTap: () => context.go('/centers'),
              ),
              const SizedBox(height: 14),
              _FeatureCard(
                icon: Icons.emoji_events_outlined,
                title: 'View Leaderboard',
                description: 'See signed-in recyclers with saved points.',
                buttonLabel: 'Open Leaderboard',
                onTap: () => context.go('/leaderboard'),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _HeroPanel extends StatelessWidget {
  const _HeroPanel({required this.isSignedIn});

  final bool isSignedIn;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: const Color(0xFFECFDF5),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFD1FAE5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.recycling, color: Color(0xFF16A34A), size: 38),
          const SizedBox(height: 14),
          const Text(
            'BinGo',
            style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 8),
          Text(
            isSignedIn
                ? 'Scan smarter, earn points, and track your recycling impact.'
                : 'Start scanning without an account. Create one later to save points.',
            style: const TextStyle(color: Color(0xFF4B5563), fontSize: 16),
          ),
          if (!isSignedIn) ...[
            const SizedBox(height: 18),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                ElevatedButton.icon(
                  onPressed: () => context.go('/register'),
                  icon: const Icon(Icons.person_add_alt_1),
                  label: const Text('Create account'),
                ),
                OutlinedButton.icon(
                  onPressed: () => context.go('/login'),
                  icon: const Icon(Icons.login),
                  label: const Text('Log in'),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  const _FeatureCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.buttonLabel,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String description;
  final String buttonLabel;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFE5E7EB)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 14,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFF16A34A), size: 30),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          Text(description),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: onTap, child: Text(buttonLabel)),
        ],
      ),
    );
  }
}

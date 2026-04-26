import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/network/api_client.dart';
import '../session/session_store.dart';

class ProfileScreen extends StatelessWidget {
  ProfileScreen({super.key});

  final ApiClient _apiClient = ApiClient();
  final SessionStore _sessionStore = SessionStore();

  Future<void> _logout(BuildContext context) async {
    await SessionStore().clearSession();
    if (!context.mounted) return;
    context.go('/home');
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: FutureBuilder<bool>(
        future: _sessionStore.hasSession(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.data != true) {
            return const _GuestProfile();
          }

          return FutureBuilder<Map<String, dynamic>>(
            future: _apiClient.get('/api/users/profile', authenticated: true),
            builder: (context, profileSnapshot) {
              final user = profileSnapshot.data;
              final username = user?['username']?.toString() ?? 'Profile';
              final email = user?['email']?.toString() ?? '';
              final points = user?['points']?.toString() ?? '0';

              return Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const CircleAvatar(
                      radius: 34,
                      child: Icon(Icons.person, size: 36),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      username,
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    if (profileSnapshot.connectionState ==
                        ConnectionState.waiting)
                      const Text(
                        'Loading profile...',
                        style: TextStyle(color: Color(0xFF6B7280)),
                      )
                    else if (profileSnapshot.hasError)
                      Text(
                        'Failed to load profile: ${profileSnapshot.error}',
                        style: const TextStyle(color: Color(0xFFB91C1C)),
                      )
                    else
                      Text(
                        '$email\n$points points',
                        style: const TextStyle(color: Color(0xFF6B7280)),
                      ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => _logout(context),
                      icon: const Icon(Icons.logout),
                      label: const Text('Log out'),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class _GuestProfile extends StatelessWidget {
  const _GuestProfile();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CircleAvatar(
            radius: 34,
            child: Icon(Icons.person_outline, size: 36),
          ),
          const SizedBox(height: 16),
          const Text(
            'Guest mode',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'You can scan materials without an account. Create one to save points and appear on the leaderboard.',
            style: TextStyle(color: Color(0xFF6B7280), fontSize: 15),
          ),
          const SizedBox(height: 24),
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
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFECFDF5),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFD1FAE5)),
            ),
            child: const Row(
              children: [
                Icon(Icons.info_outline, color: Color(0xFF16A34A)),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Guest scans return classification results only. Points start saving after sign in.',
                    style: TextStyle(color: Color(0xFF166534)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

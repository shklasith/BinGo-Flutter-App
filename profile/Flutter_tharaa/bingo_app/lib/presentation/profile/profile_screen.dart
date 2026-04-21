import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../domain/entities/app_user.dart';
import '../../services/profile_service.dart';
import '../../services/session_service.dart';
import '../../shared/app_scaffold.dart';
import '../../shared/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {

  final ProfileService profileService = ProfileService();
  final SessionService sessionService = SessionService();

  AppUser? user;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    loadProfile();
  }

  Future<void> loadProfile() async {

    try {
      final data = await profileService.fetchUser();

      setState(() {
        user = data;
        loading = false;
      });

    } catch (e) {

      setState(() {
        error = e.toString();
        loading = false;
      });

    }
  }

  @override
  Widget build(BuildContext context) {

    return AppScaffold(
      currentIndex: 3,
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text("Failed to load profile"))
              : _ProfileView(
                  user: user!,
                  sessionService: sessionService,
                ),
    );
  }
}

class _ProfileView extends StatelessWidget {

  final AppUser user;
  final SessionService sessionService;

  const _ProfileView({
    required this.user,
    required this.sessionService,
  });

  @override
  Widget build(BuildContext context) {

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
      children: [

        const Text(
          "Profile",
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w800,
          ),
        ),

        const SizedBox(height: 20),

        Row(
          children: [

            Container(
              width: 92,
              height: 92,
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.eco,
                color: AppTheme.primary,
                size: 42,
              ),
            ),

            const SizedBox(width: 14),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                Text(
                  user.username,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                  ),
                ),

                const SizedBox(height: 6),

                Text(
                  "Points: ${user.points}",
                  style: const TextStyle(
                    color: AppTheme.muted,
                  ),
                ),
              ],
            )
          ],
        ),

        const SizedBox(height: 30),

        const Text(
          "Badges Earned",
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
          ),
        ),

        const SizedBox(height: 12),

        ...user.badges.map(
          (badge) => ListTile(
            leading: const Icon(Icons.emoji_events),
            title: Text(badge),
          ),
        ),

        const SizedBox(height: 20),

        OutlinedButton.icon(
          icon: const Icon(Icons.logout),
          label: const Text("Log Out"),
          onPressed: () async {

            await sessionService.clearSession();

            if (context.mounted) {
              context.go("/login");
            }

          },
        )

      ],
    );
  }
}
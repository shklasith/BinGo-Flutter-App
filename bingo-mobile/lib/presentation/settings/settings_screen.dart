import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../profile/profile_provider.dart';
import '../session/session_controller.dart';
import '../shared/app_theme.dart';
import 'settings_controller.dart';

const String appVersionLabel = '1.0.0+1';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  late final ProviderSubscription<String?> _feedbackSubscription;

  @override
  void initState() {
    super.initState();
    _feedbackSubscription = ref.listenManual<String?>(
      settingsFeedbackProvider,
      (previous, next) {
        if (next == null || !mounted) {
          return;
        }

        final messenger = ScaffoldMessenger.maybeOf(context);
        messenger?.showSnackBar(SnackBar(content: Text(next)));
        ref.read(settingsControllerProvider.notifier).clearFeedback();
      },
    );
  }

  @override
  void dispose() {
    _feedbackSubscription.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final settingsAsync = ref.watch(settingsControllerProvider);
    final profileAsync = ref.watch(profileProvider);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        elevation: 0,
        scrolledUnderElevation: 0,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
          children: <Widget>[
            _SectionCard(
              title: 'Account',
              child: profileAsync.when(
                data: (user) => Column(
                  children: <Widget>[
                    _InfoRow(
                      icon: Icons.person_outline,
                      title: user.username,
                      subtitle: user.email,
                    ),
                    const Divider(height: 1),
                    _ActionRow(
                      icon: Icons.logout,
                      title: 'Log Out',
                      color: const Color(0xFFDC2626),
                      onTap: () async {
                        await ref
                            .read(sessionControllerProvider.notifier)
                            .clear();
                        if (context.mounted) {
                          context.go('/login');
                        }
                      },
                    ),
                  ],
                ),
                loading: () => const Padding(
                  padding: EdgeInsets.all(16),
                  child: Center(child: CircularProgressIndicator()),
                ),
                error: (Object error, StackTrace stackTrace) => Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    'Failed to load account details.',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.error,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            _SectionCard(
              title: 'Preferences',
              child: settingsAsync.when(
                data: (settings) => Column(
                  children: <Widget>[
                    _ToggleRow(
                      icon: Icons.dark_mode_outlined,
                      title: 'Dark Mode',
                      subtitle: 'Use a darker appearance across the app.',
                      value: settings.darkMode,
                      onChanged: (value) => ref
                          .read(settingsControllerProvider.notifier)
                          .setDarkMode(value),
                    ),
                  ],
                ),
                loading: () => const Padding(
                  padding: EdgeInsets.all(16),
                  child: Center(child: CircularProgressIndicator()),
                ),
                error: (Object error, StackTrace stackTrace) => _SettingsError(
                  onRetry: () => ref.invalidate(settingsControllerProvider),
                ),
              ),
            ),
            const SizedBox(height: 16),
            _SectionCard(
              title: 'Notifications',
              child: settingsAsync.when(
                data: (settings) => Column(
                  children: <Widget>[
                    _ToggleRow(
                      icon: Icons.notifications_active_outlined,
                      title: 'Scan Reminders',
                      subtitle: 'Get reminders to keep your streak going.',
                      value: settings.scanReminders,
                      onChanged: (value) => ref
                          .read(settingsControllerProvider.notifier)
                          .setScanReminders(value),
                    ),
                    const Divider(height: 1),
                    _ToggleRow(
                      icon: Icons.tips_and_updates_outlined,
                      title: 'Recycling Tips',
                      subtitle: 'Receive bite-sized sustainability tips.',
                      value: settings.recyclingTips,
                      onChanged: (value) => ref
                          .read(settingsControllerProvider.notifier)
                          .setRecyclingTips(value),
                    ),
                  ],
                ),
                loading: () => const Padding(
                  padding: EdgeInsets.all(16),
                  child: Center(child: CircularProgressIndicator()),
                ),
                error: (Object error, StackTrace stackTrace) => _SettingsError(
                  onRetry: () => ref.invalidate(settingsControllerProvider),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const _SectionCard(
              title: 'About',
              child: Column(
                children: <Widget>[
                  _InfoRow(
                    icon: Icons.info_outline,
                    title: 'App Version',
                    subtitle: appVersionLabel,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(
            title,
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: Theme.of(context).dividerColor.withValues(alpha: 0.5),
            ),
          ),
          child: child,
        ),
      ],
    );
  }
}

class _ToggleRow extends StatelessWidget {
  const _ToggleRow({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile.adaptive(
      value: value,
      onChanged: onChanged,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      secondary: Icon(icon, color: AppTheme.primary),
      activeThumbColor: AppTheme.primary,
      activeTrackColor: AppTheme.primary.withValues(alpha: 0.35),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      subtitle: Text(
        subtitle,
        style: TextStyle(color: Theme.of(context).textTheme.bodySmall?.color),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.primary),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      subtitle: Text(subtitle),
    );
  }
}

class _ActionRow extends StatelessWidget {
  const _ActionRow({
    required this.icon,
    required this.title,
    required this.onTap,
    this.color,
  });

  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Icon(icon, color: color ?? AppTheme.primary),
      title: Text(
        title,
        style: TextStyle(fontWeight: FontWeight.w700, color: color),
      ),
      trailing: const Icon(Icons.chevron_right),
    );
  }
}

class _SettingsError extends StatelessWidget {
  const _SettingsError({required this.onRetry});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            'Failed to load settings.',
            style: TextStyle(color: Theme.of(context).colorScheme.error),
          ),
          const SizedBox(height: 8),
          TextButton(onPressed: onRetry, child: const Text('Retry')),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../profile/profile_provider.dart';
import '../session/session_controller.dart';
import '../settings/settings_controller.dart';
import '../settings/settings_model.dart';
import '../shared/app_theme.dart';

const String appVersionLabel = '1.0.0+1';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _settingsController = SettingsController();

  UserProfile? _profile;
  bool _profileLoading = true;
  String? _profileError;

  @override
  void initState() {
    super.initState();
    _settingsController.addListener(_onSettingsChanged);
    _loadProfile();
  }

  @override
  void dispose() {
    _settingsController.removeListener(_onSettingsChanged);
    super.dispose();
  }

  void _onSettingsChanged() {
    final feedback = _settingsController.feedback;
    if (feedback != null && mounted) {
      ScaffoldMessenger.maybeOf(context)
          ?.showSnackBar(SnackBar(content: Text(feedback)));
      _settingsController.clearFeedback();
    }
    if (mounted) setState(() {});
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await profileService.fetchProfile();
      if (mounted) {
        setState(() {
          _profile = profile;
          _profileLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _profileError = 'Failed to load account details.';
          _profileLoading = false;
        });
      }
    }
  }

  Future<void> _logout() async {
    await sessionController.clear();
    if (mounted) context.go('/login');
  }

  AppSettings get _settings => _settingsController.settings;

  @override
  Widget build(BuildContext context) {
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
              child: _buildAccountSection(),
            ),
            const SizedBox(height: 16),
            _SectionCard(
              title: 'Preferences',
              child: Column(
                children: <Widget>[
                  _ToggleRow(
                    icon: Icons.dark_mode_outlined,
                    title: 'Dark Mode',
                    subtitle: 'Use a darker appearance across the app.',
                    value: _settings.darkMode,
                    onChanged: _settingsController.setDarkMode,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            _SectionCard(
              title: 'Notifications',
              child: Column(
                children: <Widget>[
                  _ToggleRow(
                    icon: Icons.notifications_active_outlined,
                    title: 'Scan Reminders',
                    subtitle: 'Get reminders to keep your streak going.',
                    value: _settings.scanReminders,
                    onChanged: _settingsController.setScanReminders,
                  ),
                  const Divider(height: 1),
                  _ToggleRow(
                    icon: Icons.tips_and_updates_outlined,
                    title: 'Recycling Tips',
                    subtitle: 'Receive bite-sized sustainability tips.',
                    value: _settings.recyclingTips,
                    onChanged: _settingsController.setRecyclingTips,
                  ),
                ],
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

  Widget _buildAccountSection() {
    if (_profileLoading) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Center(child: CircularProgressIndicator()),
      );
    }
    if (_profileError != null) {
      return Padding(
        padding: const EdgeInsets.all(16),
        child: Text(
          _profileError!,
          style: TextStyle(color: Theme.of(context).colorScheme.error),
        ),
      );
    }
    return Column(
      children: <Widget>[
        _InfoRow(
          icon: Icons.person_outline,
          title: _profile!.username,
          subtitle: _profile!.email,
        ),
        const Divider(height: 1),
        _ActionRow(
          icon: Icons.logout,
          title: 'Log Out',
          color: const Color(0xFFDC2626),
          onTap: _logout,
        ),
      ],
    );
  }
}

// ── Sub-widgets ────────────────────────────────────────────────────────────

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
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w800),
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

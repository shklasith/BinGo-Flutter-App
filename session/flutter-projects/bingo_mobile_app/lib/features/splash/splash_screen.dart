import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../auth/session_controller.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {

  @override
  void initState() {
    super.initState();
    _init();
  }

  void _init() async {
    final userId = await SessionController().getCurrentUserId();

    if (!mounted) return;

    if (userId == null || userId.isEmpty) {
      context.go('/login');
    } else {
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: _SplashLoading()),
    );
  }
}

class _SplashLoading extends StatelessWidget {
  const _SplashLoading();

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 74,
          height: 74,
          decoration: BoxDecoration(
            color: AppTheme.primary.withOpacity(0.12),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.eco, color: AppTheme.primary, size: 38),
        ),
        const SizedBox(height: 16),
        const Text('BinGo', style: TextStyle(fontSize: 28)),
        const SizedBox(height: 12),
        const CircularProgressIndicator(),
      ],
    );
  }
}
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../shared/app_theme.dart';
import 'session_controller.dart';

class SplashScreen extends ConsumerWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen(sessionControllerProvider, (previous, next) {
      next.whenData((String? userId) {
        if (!context.mounted) {
          return;
        }
        if (userId == null || userId.isEmpty) {
          context.go('/login');
        } else {
          context.go('/home');
        }
      });
    });

    final sessionState = ref.watch(sessionControllerProvider);

    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 430),
          child: Container(
            color: Colors.white,
            child: Center(
              child: sessionState.when(
                data: (_) => const _SplashLoading(),
                loading: () => const _SplashLoading(),
                error: (Object error, StackTrace stackTrace) => Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text('Failed to initialize session: $error'),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _SplashLoading extends StatelessWidget {
  const _SplashLoading();

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Container(
          width: 74,
          height: 74,
          decoration: BoxDecoration(
            color: AppTheme.primary.withValues(alpha: 0.12),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.eco_outlined,
            color: AppTheme.primary,
            size: 38,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'BinGo',
          style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 12),
        const SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(strokeWidth: 2.2),
        ),
      ],
    );
  }
}

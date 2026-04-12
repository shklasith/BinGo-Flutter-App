import 'package:go_router/go_router.dart';

import '../features/scan/scan_screen.dart';
import '../features/scan/scan_result_screen.dart';
import '../domain/entities/scan_result.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/scan',
  routes: [
    GoRoute(
      path: '/scan',
      builder: (context, state) => const ScanScreen(),
    ),
    GoRoute(
      path: '/scan-result',
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>? ?? {};
        return ScanResultScreen(
          imagePath: extra['imagePath'] as String? ?? '',
          result: extra['result'] as ScanResult,
        );
      },
    ),
  ],
);
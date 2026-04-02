import 'dart:io';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../domain/entities/scan_result.dart';
import '../shared/app_theme.dart';

class ScanResultScreen extends StatelessWidget {
  const ScanResultScreen({
    required this.result,
    required this.imagePath,
    super.key,
  });

  final ScanResult result;
  final String imagePath;

  @override
  Widget build(BuildContext context) {
    final style = _styleFor(result.classification.category);

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 430),
            child: ListView(
              padding: EdgeInsets.zero,
              children: <Widget>[
                SizedBox(
                  height: 260,
                  child: Stack(
                    children: <Widget>[
                      Positioned.fill(
                        child: Image.file(File(imagePath), fit: BoxFit.cover),
                      ),
                      Positioned.fill(
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: <Color>[
                                Colors.black.withValues(alpha: 0.45),
                                Colors.transparent,
                              ],
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        top: 14,
                        left: 14,
                        child: GestureDetector(
                          onTap: () => context.go('/home'),
                          child: Container(
                            width: 42,
                            height: 42,
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.24),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.arrow_back,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        right: 16,
                        bottom: 16,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: style.color,
                            borderRadius: BorderRadius.circular(14),
                            boxShadow: const <BoxShadow>[
                              BoxShadow(
                                color: Color(0x33000000),
                                blurRadius: 12,
                                offset: Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Row(
                            children: <Widget>[
                              const Icon(
                                Icons.check_circle,
                                color: Colors.white,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                '${result.classification.category} ${(result.classification.confidence * 100).toStringAsFixed(0)}%',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 22, 20, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        '${result.classification.category} Item',
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 7,
                        ),
                        decoration: BoxDecoration(
                          color: style.light,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            Icon(style.icon, color: style.color, size: 16),
                            const SizedBox(width: 6),
                            Text(
                              'Dispose in ${style.label}',
                              style: TextStyle(
                                color: style.color,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 18),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: const Color(0xFFF3F4F6)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            const Row(
                              children: <Widget>[
                                Icon(Icons.info_outline, color: AppTheme.muted),
                                SizedBox(width: 8),
                                Text(
                                  'Preparation Steps',
                                  style: TextStyle(
                                    fontSize: 19,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),
                            ...result.classification.prepSteps
                                .asMap()
                                .entries
                                .map(
                                  (entry) => Padding(
                                    padding: const EdgeInsets.only(bottom: 10),
                                    child: Row(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Container(
                                          width: 24,
                                          height: 24,
                                          alignment: Alignment.center,
                                          decoration: BoxDecoration(
                                            color: AppTheme.primary.withValues(
                                              alpha: 0.12,
                                            ),
                                            shape: BoxShape.circle,
                                          ),
                                          child: Text(
                                            '${entry.key + 1}',
                                            style: const TextStyle(
                                              color: AppTheme.primary,
                                              fontWeight: FontWeight.w700,
                                              fontSize: 12,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 10),
                                        Expanded(
                                          child: Text(
                                            entry.value,
                                            style: const TextStyle(
                                              color: AppTheme.muted,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                          ],
                        ),
                      ),
                      if (result.pointsEarned > 0) ...<Widget>[
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: <Color>[
                                Color(0xFFFFFBEB),
                                Color(0xFFFFEDD5),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: const Color(0xFFFDE68A)),
                          ),
                          child: Row(
                            children: <Widget>[
                              const Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: <Widget>[
                                    Text(
                                      'Awesome job!',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w800,
                                        color: Color(0xFF92400E),
                                      ),
                                    ),
                                    SizedBox(height: 2),
                                    Text(
                                      'You earned points for sorting.',
                                      style: TextStyle(
                                        color: Color(0xFFB45309),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  '+${result.pointsEarned} pts',
                                  style: const TextStyle(
                                    color: Color(0xFFF59E0B),
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF111827),
                          ),
                          onPressed: () => context.go('/home'),
                          child: const Text('Done'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  _ResultStyle _styleFor(String category) {
    switch (category.toLowerCase()) {
      case 'recyclable':
        return const _ResultStyle(
          color: Color(0xFF3B82F6),
          light: Color(0xFFEFF6FF),
          icon: Icons.recycling,
          label: 'Blue Bin',
        );
      case 'compost':
        return const _ResultStyle(
          color: Color(0xFF22C55E),
          light: Color(0xFFF0FDF4),
          icon: Icons.eco,
          label: 'Green Bin',
        );
      case 'landfill':
        return const _ResultStyle(
          color: Color(0xFF111827),
          light: Color(0xFFF3F4F6),
          icon: Icons.local_fire_department,
          label: 'Black Bin',
        );
      default:
        return const _ResultStyle(
          color: Color(0xFFF97316),
          light: Color(0xFFFFF7ED),
          icon: Icons.warning_amber,
          label: 'Special Drop-off',
        );
    }
  }
}

class _ResultStyle {
  const _ResultStyle({
    required this.color,
    required this.light,
    required this.icon,
    required this.label,
  });

  final Color color;
  final Color light;
  final IconData icon;
  final String label;
}

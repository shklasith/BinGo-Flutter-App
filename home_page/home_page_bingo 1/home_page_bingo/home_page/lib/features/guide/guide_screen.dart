import 'package:flutter/material.dart';

import '../../shared/app_scaffold.dart';

class GuideScreen extends StatelessWidget {
  const GuideScreen({super.key});

  static const List<_GuideCategory> _categories = <_GuideCategory>[
    _GuideCategory(
      icon: Icons.inventory_2_outlined,
      label: 'Plastic',
      bg: Color(0xFFEFF6FF),
      fg: Color(0xFF3B82F6),
      tips: <String>[
        'Rinse containers before recycling.',
        'Remove caps and lids.',
        'Crush bottles to save space.',
        'Check the resin code (1–7) on the bottom.',
      ],
    ),
    _GuideCategory(
      icon: Icons.wine_bar_outlined,
      label: 'Glass',
      bg: Color(0xFFEFFCF9),
      fg: Color(0xFF14B8A6),
      tips: <String>[
        'Clean and remove metal lids.',
        'Do not mix with window or mirror glass.',
        'Separate by colour if required locally.',
      ],
    ),
    _GuideCategory(
      icon: Icons.description_outlined,
      label: 'Paper',
      bg: Color(0xFFF0FDF4),
      fg: Color(0xFF22C55E),
      tips: <String>[
        'Keep dry — wet paper cannot be recycled.',
        'Flatten cardboard boxes.',
        'Remove plastic windows from envelopes.',
      ],
    ),
    _GuideCategory(
      icon: Icons.battery_alert_outlined,
      label: 'E-Waste',
      bg: Color(0xFFFFF7ED),
      fg: Color(0xFFF97316),
      tips: <String>[
        'Never place in regular bins.',
        'Drop at a certified e-waste centre.',
        'Erase personal data before disposal.',
        'Batteries must be taped at terminals.',
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      currentIndex: 2,
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
        children: <Widget>[
          const Text(
            'Recycling Guide',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 16),
          ..._categories.map((c) => _CategoryCard(category: c)),
        ],
      ),
    );
  }
}

class _GuideCategory {
  const _GuideCategory({
    required this.icon,
    required this.label,
    required this.bg,
    required this.fg,
    required this.tips,
  });

  final IconData     icon;
  final String       label;
  final Color        bg;
  final Color        fg;
  final List<String> tips;
}

class _CategoryCard extends StatelessWidget {
  const _CategoryCard({required this.category});

  final _GuideCategory category;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF3F4F6)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: category.bg,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(category.icon, color: category.fg),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(category.label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                ...category.tips.map(
                  (String t) => Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Icon(Icons.check_circle_outline, size: 16, color: category.fg),
                        const SizedBox(width: 6),
                        Expanded(child: Text(t, style: const TextStyle(fontSize: 13))),
                      ],
                    ),
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

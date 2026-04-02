import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../shared/app_scaffold.dart';
import '../shared/app_theme.dart';
import 'home_providers.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dailyTipAsync = ref.watch(dailyTipProvider);
    final searchResultsAsync = ref.watch(tipSearchProvider);
    final query = ref.watch(tipSearchQueryProvider);

    return AppScaffold(
      currentIndex: 0,
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(dailyTipProvider);
          ref.invalidate(tipSearchProvider);
        },
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: <Color>[AppTheme.primary, Color(0xFF16A34A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.vertical(
                  bottom: Radius.circular(36),
                ),
              ),
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.eco_outlined,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text(
                              'Good Morning,',
                              style: TextStyle(
                                color: Color(0xFFD1FAE5),
                                fontSize: 13,
                              ),
                            ),
                            Text(
                              'Eco Warrior',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 20,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.notifications_none,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    decoration: InputDecoration(
                      hintText: 'Search how to recycle items...',
                      hintStyle: const TextStyle(color: Color(0xFF9CA3AF)),
                      prefixIcon: const Icon(
                        Icons.search,
                        color: Color(0xFF9CA3AF),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 12,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(18),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onChanged: (String value) =>
                        ref.read(tipSearchQueryProvider.notifier).state = value,
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  dailyTipAsync.when(
                    data: (tip) =>
                        _ImpactCard(title: tip.title, content: tip.content),
                    loading: () => const _LoadingCard(),
                    error: (Object error, StackTrace stackTrace) =>
                        _ErrorCard(message: 'Tip failed: $error'),
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    'Quick Guide',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 12),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      _GuideItem(
                        icon: Icons.inventory_2_outlined,
                        label: 'Plastic',
                        bg: Color(0xFFEFF6FF),
                        fg: Color(0xFF3B82F6),
                      ),
                      _GuideItem(
                        icon: Icons.wine_bar_outlined,
                        label: 'Glass',
                        bg: Color(0xFFEFFCF9),
                        fg: Color(0xFF14B8A6),
                      ),
                      _GuideItem(
                        icon: Icons.description_outlined,
                        label: 'Paper',
                        bg: Color(0xFFF0FDF4),
                        fg: Color(0xFF22C55E),
                      ),
                      _GuideItem(
                        icon: Icons.battery_alert_outlined,
                        label: 'E-Waste',
                        bg: Color(0xFFFFF7ED),
                        fg: Color(0xFFF97316),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Row(
                    children: <Widget>[
                      const Text(
                        'Nearby Center',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const Spacer(),
                      GestureDetector(
                        onTap: () => context.go('/centers'),
                        child: const Text(
                          'View All',
                          style: TextStyle(
                            color: AppTheme.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFF3F4F6)),
                    ),
                    child: const Row(
                      children: <Widget>[
                        _PinBox(),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text(
                                'City Eco Hub',
                                style: TextStyle(fontWeight: FontWeight.w700),
                              ),
                              SizedBox(height: 2),
                              Text(
                                '1.2 km away • Open till 5 PM',
                                style: TextStyle(
                                  color: AppTheme.muted,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (query.trim().isNotEmpty) ...<Widget>[
                    const SizedBox(height: 18),
                    const Text(
                      'Search Results',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    searchResultsAsync.when(
                      data: (results) {
                        if (results.isEmpty) {
                          return const Text('No tips found for this query.');
                        }
                        return Column(
                          children: results
                              .map(
                                (tip) => Container(
                                  width: double.infinity,
                                  margin: const EdgeInsets.only(bottom: 8),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: const Color(0xFFE5E7EB),
                                    ),
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: <Widget>[
                                      Text(
                                        tip.title,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(tip.content),
                                    ],
                                  ),
                                ),
                              )
                              .toList(),
                        );
                      },
                      loading: () => const _LoadingCard(),
                      error: (Object error, StackTrace stackTrace) =>
                          _ErrorCard(message: 'Search failed: $error'),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ImpactCard extends StatelessWidget {
  const _ImpactCard({required this.title, required this.content});

  final String title;
  final String content;

  @override
  Widget build(BuildContext context) {
    return Container(
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
          const Text(
            'Your Impact',
            style: TextStyle(
              color: AppTheme.muted,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            '4,250 pts',
            style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 10),
          Row(
            children: const <Widget>[
              _Stat(label: 'Plastic Diverted', value: '12 kg'),
              SizedBox(width: 10),
              _Stat(label: 'CO2 Reduced', value: '5.2 kg'),
              SizedBox(width: 10),
              _Stat(label: 'Trees Saved', value: '0.5'),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 4),
          Text(content, style: const TextStyle(color: AppTheme.muted)),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            label,
            style: const TextStyle(fontSize: 11, color: AppTheme.muted),
          ),
          const SizedBox(height: 3),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class _GuideItem extends StatelessWidget {
  const _GuideItem({
    required this.icon,
    required this.label,
    required this.bg,
    required this.fg,
  });

  final IconData icon;
  final String label;
  final Color bg;
  final Color fg;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(icon, color: fg),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: AppTheme.muted,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

class _PinBox extends StatelessWidget {
  const _PinBox();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 46,
      height: 46,
      decoration: BoxDecoration(
        color: AppTheme.primary.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Icon(Icons.navigation, color: AppTheme.primary),
    );
  }
}

class _LoadingCard extends StatelessWidget {
  const _LoadingCard();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 16),
      child: Center(child: CircularProgressIndicator()),
    );
  }
}

class _ErrorCard extends StatelessWidget {
  const _ErrorCard({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7ED),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(message),
    );
  }
}

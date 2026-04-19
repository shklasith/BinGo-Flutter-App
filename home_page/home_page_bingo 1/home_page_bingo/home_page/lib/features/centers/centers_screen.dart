import 'package:flutter/material.dart';

import '../../shared/app_scaffold.dart';
import '../../shared/app_theme.dart';

class CentersScreen extends StatelessWidget {
  const CentersScreen({super.key});

  static const List<_Center> _centers = <_Center>[
    _Center(name: 'City Eco Hub',       distance: '1.2 km', hours: 'Open till 5 PM'),
    _Center(name: 'Green Point Station',distance: '2.8 km', hours: 'Open till 7 PM'),
    _Center(name: 'Westside Recycler',  distance: '4.1 km', hours: 'Open till 4 PM'),
    _Center(name: 'EcoZone East',       distance: '5.0 km', hours: 'Open till 6 PM'),
  ];

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      currentIndex: 1,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 20, 20, 12),
            child: Text(
              'Recycling Centers',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: _centers.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (_, int i) => _CenterTile(center: _centers[i]),
            ),
          ),
        ],
      ),
    );
  }
}

class _Center {
  const _Center({required this.name, required this.distance, required this.hours});
  final String name;
  final String distance;
  final String hours;
}

class _CenterTile extends StatelessWidget {
  const _CenterTile({required this.center});

  final _Center center;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF3F4F6)),
      ),
      child: Row(
        children: <Widget>[
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: AppTheme.primary.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.navigation, color: AppTheme.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(center.name, style: const TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 2),
                Text(
                  '${center.distance} away • ${center.hours}',
                  style: const TextStyle(color: AppTheme.muted, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../models/tip.dart';
import '../../services/tip_service.dart';
import '../../shared/app_scaffold.dart';
import '../../shared/app_theme.dart';
import '../../shared/widgets/error_card.dart';
import '../../shared/widgets/loading_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TipService _service = TipService();

  Tip?   _dailyTip;
  bool   _tipLoading = true;
  String? _tipError;

  String     _query         = '';
  List<Tip>  _searchResults = <Tip>[];
  bool       _searchLoading = false;
  String?    _searchError;

  @override
  void initState() {
    super.initState();
    _loadDailyTip();
  }

  Future<void> _loadDailyTip() async {
    setState(() { _tipLoading = true; _tipError = null; });
    try {
      final Tip tip = await _service.fetchDailyTip();
      if (mounted) setState(() { _dailyTip = tip; _tipLoading = false; });
    } catch (e) {
      if (mounted) setState(() { _tipError = e.toString(); _tipLoading = false; });
    }
  }

  Future<void> _runSearch(String query) async {
    if (query.trim().isEmpty) {
      setState(() { _searchResults = <Tip>[]; _searchLoading = false; });
      return;
    }
    setState(() { _searchLoading = true; _searchError = null; });
    try {
      final List<Tip> results = await _service.searchTips(query);
      if (mounted) setState(() { _searchResults = results; _searchLoading = false; });
    } catch (e) {
      if (mounted) setState(() { _searchError = e.toString(); _searchLoading = false; });
    }
  }

  Future<void> _onRefresh() async {
    await Future.wait(<Future<void>>[
      _loadDailyTip(),
      if (_query.trim().isNotEmpty) _runSearch(_query),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      currentIndex: 0,
      body: RefreshIndicator(
        onRefresh: _onRefresh,
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            _buildHeader(),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  _buildImpactSection(),
                  const SizedBox(height: 18),
                  _buildQuickGuide(),
                  const SizedBox(height: 18),
                  _buildNearbyCenter(context),
                  if (_query.trim().isNotEmpty) ...<Widget>[
                    const SizedBox(height: 18),
                    _buildSearchResults(),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  
  Widget _buildHeader() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: <Color>[AppTheme.primary, Color(0xFF16A34A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(36)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              _circle(Icons.eco_outlined),
              const SizedBox(width: 10),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Good Morning,',
                      style: TextStyle(color: Color(0xFFD1FAE5), fontSize: 13),
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
              _circle(Icons.notifications_none),
            ],
          ),
          const SizedBox(height: 16),
          TextField(
            decoration: InputDecoration(
              hintText: 'Search how to recycle items...',
              hintStyle: const TextStyle(color: Color(0xFF9CA3AF)),
              prefixIcon: const Icon(Icons.search, color: Color(0xFF9CA3AF)),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: BorderSide.none,
              ),
            ),
            onChanged: (String value) {
              setState(() => _query = value);
              _runSearch(value);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildImpactSection() {
    if (_tipLoading) return const LoadingCard();
    if (_tipError != null) return ErrorCard(message: 'Tip failed: $_tipError');
    return _ImpactCard(title: _dailyTip!.title, content: _dailyTip!.content);
  }

  Widget _buildQuickGuide() {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text('Quick Guide', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
        SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            _GuideItem(icon: Icons.inventory_2_outlined, label: 'Plastic', bg: Color(0xFFEFF6FF), fg: Color(0xFF3B82F6)),
            _GuideItem(icon: Icons.wine_bar_outlined,    label: 'Glass',   bg: Color(0xFFEFFCF9), fg: Color(0xFF14B8A6)),
            _GuideItem(icon: Icons.description_outlined, label: 'Paper',   bg: Color(0xFFF0FDF4), fg: Color(0xFF22C55E)),
            _GuideItem(icon: Icons.battery_alert_outlined, label: 'E-Waste', bg: Color(0xFFFFF7ED), fg: Color(0xFFF97316)),
          ],
        ),
      ],
    );
  }

  Widget _buildNearbyCenter(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          children: <Widget>[
            const Text('Nearby Center', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
            const Spacer(),
            GestureDetector(
              onTap: () => context.go('/centers'),
              child: const Text('View All', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w700)),
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
                    Text('City Eco Hub', style: TextStyle(fontWeight: FontWeight.w700)),
                    SizedBox(height: 2),
                    Text('1.2 km away • Open till 5 PM', style: TextStyle(color: AppTheme.muted, fontSize: 13)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSearchResults() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        const Text('Search Results', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        if (_searchLoading)
          const LoadingCard()
        else if (_searchError != null)
          ErrorCard(message: 'Search failed: $_searchError')
        else if (_searchResults.isEmpty)
          const Text('No tips found for this query.')
        else
          Column(
            children: _searchResults.map((Tip tip) => _SearchResultTile(tip: tip)).toList(),
          ),
      ],
    );
  }

  

  Widget _circle(IconData icon) => Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.2),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: Colors.white),
      );
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
          const Text('Your Impact', style: TextStyle(color: AppTheme.muted, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          const Text('4,250 pts', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          const Row(
            children: <Widget>[
              _Stat(label: 'Plastic Diverted', value: '12 kg'),
              SizedBox(width: 10),
              _Stat(label: 'CO2 Reduced', value: '5.2 kg'),
              SizedBox(width: 10),
              _Stat(label: 'Trees Saved', value: '0.5'),
            ],
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
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
          Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.muted)),
          const SizedBox(height: 3),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
        ],
      ),
    );
  }
}

class _GuideItem extends StatelessWidget {
  const _GuideItem({required this.icon, required this.label, required this.bg, required this.fg});

  final IconData icon;
  final String   label;
  final Color    bg;
  final Color    fg;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(16)),
          child: Icon(icon, color: fg),
        ),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.muted, fontWeight: FontWeight.w600)),
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

class _SearchResultTile extends StatelessWidget {
  const _SearchResultTile({required this.tip});

  final Tip tip;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(tip.title, style: const TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(tip.content),
        ],
      ),
    );
  }
}
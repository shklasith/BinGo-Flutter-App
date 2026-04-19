import '../models/tip.dart';

class TipService {
  // Replace the bodies below with your real HTTP / Firestore calls.

  Future<Tip> fetchDailyTip() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return const Tip(
      title: 'Rinse before recycling',
      content:
          'Always rinse containers before placing them in the recycling bin '
          'to avoid contaminating other recyclables.',
    );
  }

  Future<List<Tip>> searchTips(String query) async {
    await Future.delayed(const Duration(milliseconds: 500));

    const List<Tip> all = <Tip>[
      Tip(title: 'Plastic bottles',  content: 'Remove caps and rinse thoroughly.'),
      Tip(title: 'Glass jars',       content: 'Clean and remove metal lids.'),
      Tip(title: 'Paper & cardboard',content: 'Keep dry and flatten boxes.'),
      Tip(title: 'E-Waste',          content: 'Drop at certified e-waste centres.'),
    ];

    if (query.trim().isEmpty) return <Tip>[];

    final String q = query.toLowerCase();
    return all
        .where(
          (Tip t) =>
              t.title.toLowerCase().contains(q) ||
              t.content.toLowerCase().contains(q),
        )
        .toList();
  }
}

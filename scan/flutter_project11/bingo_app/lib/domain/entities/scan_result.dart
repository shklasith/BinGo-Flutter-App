class ScanResult {
  final Classification classification;
  final int pointsEarned;

  ScanResult({
    required this.classification,
    required this.pointsEarned,
  });
}

class Classification {
  final String category;
  final double confidence;
  final List<String> prepSteps;

  Classification({
    required this.category,
    required this.confidence,
    required this.prepSteps,
  });
}
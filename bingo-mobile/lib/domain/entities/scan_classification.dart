class ScanClassification {
  const ScanClassification({
    required this.category,
    required this.prepSteps,
    required this.confidence,
  });

  final String category;
  final List<String> prepSteps;
  final double confidence;
}

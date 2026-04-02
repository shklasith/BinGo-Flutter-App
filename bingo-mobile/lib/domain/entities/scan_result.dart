import 'scan_classification.dart';

class ScanResult {
  const ScanResult({
    required this.scanId,
    required this.pointsEarned,
    required this.classification,
  });

  final String scanId;
  final int pointsEarned;
  final ScanClassification classification;
}

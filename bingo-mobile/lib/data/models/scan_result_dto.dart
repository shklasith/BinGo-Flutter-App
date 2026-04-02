import '../../domain/entities/scan_classification.dart';
import '../../domain/entities/scan_result.dart';

class ScanClassificationDto {
  const ScanClassificationDto({
    required this.category,
    required this.prepSteps,
    required this.confidence,
  });

  final String category;
  final List<String> prepSteps;
  final double confidence;

  factory ScanClassificationDto.fromJson(Map<String, dynamic> json) {
    return ScanClassificationDto(
      category: (json['category'] ?? 'Unknown').toString(),
      prepSteps: (json['prepSteps'] as List<dynamic>? ?? <dynamic>[])
          .map((dynamic step) => step.toString())
          .toList(),
      confidence: (json['confidence'] as num? ?? 0).toDouble(),
    );
  }

  ScanClassification toEntity() => ScanClassification(
    category: category,
    prepSteps: prepSteps,
    confidence: confidence,
  );
}

class ScanResultDto {
  const ScanResultDto({
    required this.scanId,
    required this.pointsEarned,
    required this.classification,
  });

  final String scanId;
  final int pointsEarned;
  final ScanClassificationDto classification;

  factory ScanResultDto.fromJson(Map<String, dynamic> json) {
    return ScanResultDto(
      scanId: (json['scanId'] ?? '').toString(),
      pointsEarned: (json['pointsEarned'] as num? ?? 0).toInt(),
      classification: ScanClassificationDto.fromJson(
        (json['classification'] as Map<String, dynamic>? ??
            <String, dynamic>{}),
      ),
    );
  }

  ScanResult toEntity() => ScanResult(
    scanId: scanId,
    pointsEarned: pointsEarned,
    classification: classification.toEntity(),
  );
}

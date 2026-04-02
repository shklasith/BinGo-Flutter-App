import '../../domain/entities/impact_stats.dart';

class ImpactStatsDto {
  const ImpactStatsDto({
    required this.treesSaved,
    required this.plasticDiverted,
    required this.co2Reduced,
  });

  final int treesSaved;
  final int plasticDiverted;
  final double co2Reduced;

  factory ImpactStatsDto.fromJson(Map<String, dynamic> json) {
    return ImpactStatsDto(
      treesSaved: (json['treesSaved'] as num? ?? 0).toInt(),
      plasticDiverted: (json['plasticDiverted'] as num? ?? 0).toInt(),
      co2Reduced: (json['co2Reduced'] as num? ?? 0).toDouble(),
    );
  }

  ImpactStats toEntity() => ImpactStats(
    treesSaved: treesSaved,
    plasticDiverted: plasticDiverted,
    co2Reduced: co2Reduced,
  );
}

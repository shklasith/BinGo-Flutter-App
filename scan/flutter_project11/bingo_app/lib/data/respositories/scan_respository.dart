import 'dart:io';
import '../../domain/entities/scan_result.dart';

class ScanRepository {
  Future<ScanResult> scanImage(File imageFile) async {

    // Simulated AI delay
    await Future.delayed(const Duration(seconds: 2));

    return ScanResult(
      classification: Classification(
        category: "Recyclable",
        confidence: 0.92,
        prepSteps: [
          "Rinse the container",
          "Remove labels",
          "Place in recycling bin"
        ],
      ),
      pointsEarned: 10,
    );
  }
}
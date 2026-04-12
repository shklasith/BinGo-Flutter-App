import 'dart:io';

// import 'package:bingo_app/data/repositories/scan_repository.dart';
// import 'package:bingo_app/domain/entities/scan_result.dart';

class ScanController {
  // final ScanRepository _repository = ScanRepository();

  Future<dynamic> submit(File imageFile) async {
    try {
      // final ScanResult result = await _repository.scanImage(imageFile);
      // return result;
      return null;
    } catch (e) {
      throw Exception('Scan failed: $e');
    }
  }
}
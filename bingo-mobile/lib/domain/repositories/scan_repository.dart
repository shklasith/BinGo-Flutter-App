import 'dart:io';

import '../entities/scan_result.dart';

abstract class ScanRepository {
  Future<ScanResult> scanImage(File file);
}

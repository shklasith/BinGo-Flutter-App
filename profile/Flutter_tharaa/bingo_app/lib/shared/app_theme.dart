import 'package:flutter/material.dart';

class AppTheme {

  static const Color primary = Color(0xFF22C55E);
  static const Color muted = Color(0xFF6B7280);

  static ThemeData theme = ThemeData(
    scaffoldBackgroundColor: const Color.fromARGB(255, 240, 248, 242),
    primaryColor: primary,
    useMaterial3: true,
  );

}
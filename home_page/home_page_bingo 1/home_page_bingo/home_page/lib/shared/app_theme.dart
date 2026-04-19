import 'package:flutter/material.dart';

class AppTheme {
  AppTheme._();

  static const Color primary = Color(0xFF22C55E);
  static const Color muted   = Color(0xFF6B7280);

  static ThemeData get themeData => ThemeData(
        useMaterial3: true,
        colorSchemeSeed: primary,
        scaffoldBackgroundColor: const Color(0xFFF9FAFB),
        fontFamily: 'Inter',
      );
}

import 'package:flutter/material.dart';

class AppTheme {
  AppTheme._();

  static const Color primary = Color(0xFF22C55E); // green

  static ThemeData get light => ThemeData(
        useMaterial3: true,
        colorSchemeSeed: primary,
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF4F6F8),
        cardColor: Colors.white,
        dividerColor: const Color(0xFFE5E7EB),
        textTheme: const TextTheme(
          titleMedium: TextStyle(fontSize: 15, color: Color(0xFF111827)),
          bodySmall: TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
        ),
      );

  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        colorSchemeSeed: primary,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF111827),
        cardColor: const Color(0xFF1F2937),
        dividerColor: const Color(0xFF374151),
        textTheme: const TextTheme(
          titleMedium: TextStyle(fontSize: 15, color: Color(0xFFF9FAFB)),
          bodySmall: TextStyle(fontSize: 12, color: Color(0xFF9CA3AF)),
        ),
      );
}
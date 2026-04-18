import 'package:flutter/material.dart';

class AppTheme {
  static const Color primary = Colors.green;

  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: primary,
      scaffoldBackgroundColor: Colors.white,
      colorScheme: ColorScheme.fromSeed(seedColor: primary),
    );
  }
}
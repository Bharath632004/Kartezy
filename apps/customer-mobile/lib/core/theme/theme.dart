import 'package:flutter/material.dart';

/// App theme configuration
class AppTheme {
  // Light theme
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.deepPurple,
      brightness: Brightness.light,
    ),
    // Additional theme customizations can be added here
  );

  // Dark theme
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.deepPurple,
      brightness: Brightness.dark,
    ),
  );

  // High contrast theme (example)
  static ThemeData highContrastTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.deepPurple,
      brightness: Brightness.light,
    ).copyWith(
      background: Colors.white,
      onBackground: Colors.black,
      surface: Colors.grey[100],
      onSurface: Colors.black,
    ),
  );

  /// Returns the appropriate theme based on brightness and high contrast flag
  static ThemeData getTheme({bool isDark = false, bool highContrast = false}) {
    if (highContrast) {
      return highContrastTheme;
    }
    return isDark ? darkTheme : lightTheme;
  }
}
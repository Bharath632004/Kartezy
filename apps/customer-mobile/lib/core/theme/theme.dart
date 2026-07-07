// lib/core/theme/theme.dart
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

enum AppThemeMode { light, dark, system }

// App theme configuration
class AppTheme {
  // Light theme
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.deepPurple,
      brightness: Brightness.light,
    ),
    // Additional theme customizations can be added here
    textTheme: const TextTheme(
      bodyLarge: TextStyle(fontSize: 16),
      bodyMedium: TextStyle(fontSize: 14),
      bodySmall: TextStyle(fontSize: 12),
      titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
      titleMedium: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      titleSmall: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
    ),
  );

  // Dark theme
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.deepPurple,
      brightness: Brightness.dark,
    ),
    textTheme: const TextTheme(
      bodyLarge: TextStyle(fontSize: 16, color: Colors.white70),
      bodyMedium: TextStyle(fontSize: 14, color: Colors.white70),
      bodySmall: TextStyle(fontSize: 12, color: Colors.white70),
      titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
      titleMedium: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
      titleSmall: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
    ),
  );

  // High contrast theme (light background with dark text and accents)
  static ThemeData highContrastTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.deepPurple,
      brightness: Brightness.light,
    ).copyWith(
      surface: Colors.white,
      onSurface: Colors.black,
    ),
    textTheme: const TextTheme(
      bodyLarge: TextStyle(fontSize: 16, color: Colors.black),
      bodyMedium: TextStyle(fontSize: 14, color: Colors.black),
      bodySmall: TextStyle(fontSize: 12, color: Colors.black),
      titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black),
      titleMedium: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black),
      titleSmall: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black),
    ),
  );

  /// Returns the appropriate theme based on theme mode and high contrast flag
  static ThemeData getTheme({
    required AppThemeMode themeMode,
    required bool highContrast,
  }) {
    if (highContrast) {
      return highContrastTheme;
    }
    switch (themeMode) {
      case AppThemeMode.system:
        final brightness = WidgetsBinding.instance.window.platformBrightness;
        return brightness == Brightness.dark ? darkTheme : lightTheme;
      case AppThemeMode.light:
        return lightTheme;
      case AppThemeMode.dark:
        return darkTheme;
    }
  }
}
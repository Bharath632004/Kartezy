import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme.dart';

/// Theme state notifier
class ThemeNotifier extends StateNotifier<ThemeMode> {
  ThemeNotifier() : super(ThemeMode.system);

  void toggleTheme(bool isDark) {
    state = isDark ? ThemeMode.dark : ThemeMode.light;
  }

  void setThemeMode(ThemeMode mode) {
    state = mode;
  }

  void enableHighContrast(bool enable) {
    // For simplicity, we'll just toggle between light and high contrast
    // In a more complex app, you might have a separate state for high contrast
    if (enable) {
      // We don't have a ThemeMode for high contrast, so we'll use a custom approach
      // For now, we'll just use light theme with high contrast colors
      // This is a simplification; in reality, you might need a custom ThemeMode or
      // a different way to handle high contrast.
      // We'll just set to light and rely on the high contrast theme in the theme data.
      // We'll handle this in the theme selection logic.
    } else {
      // Reset to previous mode? This is a simplified example.
    }
  }
}

/// Provider for theme notifier
final themeNotifierProvider =
    StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  return ThemeNotifier();
});

/// Provider to get the current ThemeData based on theme mode and high contrast
final themeProvider = Provider<ThemeData>((ref) {
  final themeMode = ref.watch(themeNotifierProvider);
  final brightness = WidgetsBinding.instance.window.platformBrightness;
  final isDark = themeMode == ThemeMode.dark ||
      (themeMode == ThemeMode.system && brightness == Brightness.dark);
  // For high contrast, we would need additional state; for now, we ignore.
  return AppTheme.getTheme(isDark: isDark, highContrast: false);
});
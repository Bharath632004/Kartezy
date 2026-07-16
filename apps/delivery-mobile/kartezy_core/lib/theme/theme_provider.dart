import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:kartezy_core/storage/hive_manager.dart';
import 'package:flutter/material.dart';
import 'theme.dart';
import 'dart:ui';

class ThemeNotifier extends StateNotifier<AppThemeMode> {
  ThemeNotifier(this._ref) : super(AppThemeMode.system) {
    _loadFromPreferences();
  }

  final Ref _ref;
  late final Box _settingsBox;

  void _loadFromPreferences() {
    final hiveManager = _ref.read(hiveManagerProvider);
    _settingsBox = hiveManager.getBox<bool>(boxName: 'settings');
    final themeMode = _settingsBox.get(
      'themeMode',
      defaultValue: AppThemeMode.system.index,
    );
    state = AppThemeMode.values[themeMode];
  }

  void setThemeMode(AppThemeMode mode) {
    state = mode;
    _settingsBox.put('themeMode', mode.index);
  }

  bool get isDarkMode {
    final brightness = PlatformDispatcher.instance.platformBrightness;
    switch (state) {
      case AppThemeMode.system:
        return brightness == Brightness.dark;
      case AppThemeMode.light:
        return false;
      case AppThemeMode.dark:
        return true;
    }
  }
}

/// Provider for theme notifier
final themeNotifierProvider =
    StateNotifierProvider<ThemeNotifier, AppThemeMode>((ref) {
      return ThemeNotifier(ref);
    });

/// Provider to get the current ThemeData based on theme mode and high contrast
final themeProvider = Provider<ThemeData>((ref) {
  final themeMode = ref.watch(themeNotifierProvider);
  // For high contrast, we would need additional state; for now, we ignore.
  return AppTheme.getTheme(themeMode: themeMode, highContrast: false);
});

// lib/core/theme/theme_provider.dart
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';
import 'package:customer_mobile/core/storage/hive_manager.dart';
import 'theme.dart';

enum AppThemeMode { light, dark, system }

class ThemeNotifier extends StateNotifier<AppThemeMode> {
  ThemeNotifier(this._ref) : super(AppThemeMode.system) {
    _loadFromPreferences();
  }

  final Ref _ref;
  late final Box _settingsBox;

  Future<void> _loadFromPreferences() async {
    final hiveManager = _ref.read(hiveManagerProvider);
    _settingsBox = await hiveManager.getBox<bool>(boxName: 'settings');
    final themeMode = _settingsBox.get('themeMode', defaultValue: AppThemeMode.system.index);
    state = AppThemeMode.values[themeMode];
  }

  void setThemeMode(AppThemeMode mode) {
    state = mode;
    _settingsBox.put('themeMode', mode.index);
  }

  bool get isDarkMode {
    final brightness = WidgetsBinding.instance.window.platformBrightness;
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
final themeNotifierProvider = StateNotifierProvider<ThemeNotifier, AppThemeMode>((ref) {
  return ThemeNotifier(ref);
});

/// Provider to get the current ThemeData based on theme mode and high contrast
final themeProvider = Provider<ThemeData>((ref) {
  final themeMode = ref.watch(themeNotifierProvider);
  bool isDark;
  switch (themeMode) {
    case AppThemeMode.light:
      isDark = false;
      break;
    case AppThemeMode.dark:
      isDark = true;
      break;
    case AppThemeMode.system:
      final brightness = WidgetsBinding.instance.window.platformBrightness;
      isDark = brightness == Brightness.dark;
      break;
  }
  // For high contrast, we would need additional state; for now, we ignore.
  return AppTheme.getTheme(isDark: isDark, highContrast: false);
});
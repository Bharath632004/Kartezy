import 'package:hive/hive.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HiveManager {
  Box<dynamic> get _settingsBox => Hive.box('settings');
  Box<dynamic> get _userBox => Hive.box('user');
  Box<dynamic> get _merchantBox => Hive.box('merchant');

  Future<void> saveUser(Map<String, dynamic> user) async {
    await _userBox.put('userData', user);
  }

  Map<String, dynamic>? getUser() {
    return _userBox.get('userData');
  }

  Future<void> saveMerchant(Map<String, dynamic> merchant) async {
    await _merchantBox.put('merchantData', merchant);
  }

  Map<String, dynamic>? getMerchant() {
    return _merchantBox.get('merchantData');
  }

  Future<void> saveSettings(Map<String, dynamic> settings) async {
    await _settingsBox.put('settingsData', settings);
  }

  Map<String, dynamic>? getSettings() {
    return _settingsBox.get('settingsData');
  }

  Future<void> setHasSeenOnboarding(bool value) async {
    await _settingsBox.put('hasSeenOnboarding', value);
  }

  Future<bool> getHasSeenOnboarding() async {
    final value = _settingsBox.get('hasSeenOnboarding');
    if (value is bool) {
      return value;
    }
    return false;
  }

  Future<void> clear() async {
    await _userBox.clear();
    await _merchantBox.clear();
    await _settingsBox.clear();
  }
}

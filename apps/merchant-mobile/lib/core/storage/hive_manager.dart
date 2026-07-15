import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HiveManager {
  HiveManager._internal();
  static final HiveManager _instance = HiveManager._internal();
  factory HiveManager() => _instance;

  Future<void> init() async {
    if (!Hive.isAdapterRegistered(0)) {
      // Register any adapters here if needed
    }
    await Hive.initFlutter();
    await Hive.openBox('settings');
    await Hive.openBox('user');
    await Hive.openBox('merchant');
  }

  Box<dynamic> get _settingsBox => Hive.box('settings');
  Box<dynamic> get _userBox => Hive.box('user');
  Box<dynamic> get _merchantBox => Hive.box('merchant');

  // Settings
  Future<void> setHasSeenOnboarding(bool value) async =>
      await _settingsBox.put('hasSeenOnboarding', value);
  Future<bool> getHasSeenOnboarding() async =>
      (_settingsBox.get('hasSeenOnboarding') ?? false) as bool;

  // User
  Future<void> setUserId(String userId) async =>
      await _userBox.put('userId', userId);
  Future<String?> getUserId() async => _userBox.get('userId');

  // Merchant
  Future<void> setMerchantId(String merchantId) async =>
      await _merchantBox.put('merchantId', merchantId);
  Future<String?> getMerchantId() async => _merchantBox.get('merchantId');
}

final hiveManagerProvider = Provider<HiveManager>((ref) => HiveManager());

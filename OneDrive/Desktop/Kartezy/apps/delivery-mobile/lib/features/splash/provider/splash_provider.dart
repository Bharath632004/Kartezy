// lib/features/splash/provider/splash_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/storage/hive_manager.dart';
import 'package:kartezy_core/storage/secure_storage.dart';
import 'package:delivery_mobile/navigation/router.dart';

class SplashState {
  final bool isLoading;
  final String? nextRoute;
  final String? error;

  const SplashState({this.isLoading = true, this.nextRoute, this.error});

  SplashState copyWith({bool? isLoading, String? nextRoute, String? error}) {
    return SplashState(
      isLoading: isLoading ?? this.isLoading,
      nextRoute: nextRoute ?? this.nextRoute,
      error: error ?? this.error,
    );
  }
}

class SplashViewModel extends StateNotifier<SplashState> {
  SplashViewModel(this._ref) : super(const SplashState()) {
    _initializeApp();
  }

  final Ref _ref;

  Future<void> _initializeApp() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      // Simulate some async initialization (e.g., initializing services)
      await Future.delayed(const Duration(seconds: 2));

      final hiveManager = _ref.read(hiveManagerProvider);
      final secureStorage = _ref.read(secureStorageProvider);
      final goRouter = _ref.read(goRouterProvider);

      // Check if onboarding has been completed
      final onboardingBox = hiveManager.getBox<bool>(boxName: 'onboarding');
      final hasSeenOnboarding = onboardingBox.get(
        'hasSeenOnboarding',
        defaultValue: false,
      );

      // Check if user is logged in
      final accessToken = await secureStorage.read(key: 'accessToken');

      String? nextRoute;
      if (!hasSeenOnboarding) {
        nextRoute = '/onboarding';
      } else if (accessToken == null || accessToken.isEmpty) {
        nextRoute = '/login';
      } else {
        //  Validate token and refresh if needed
        nextRoute = '/dashboard';
      }

      state = state.copyWith(isLoading: false, nextRoute: nextRoute);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

/// Provider for splash view model
final splashProvider = StateNotifierProvider<SplashViewModel, SplashState>((
  ref,
) {
  return SplashViewModel(ref);
});

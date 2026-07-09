import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/services/merchant_service.dart';
import 'package:merchant_mobile/features/merchant_registration/data/repository/merchant_registration_repository_impl.dart';
import 'package:merchant_mobile/features/merchant_registration/domain/usecases/register_merchant_usecase.dart';
import 'package:merchant_mobile/features/merchant_registration/domain/repositories/merchant_registration_repository.dart';
import 'package:merchant_mobile/features/merchant_registration/domain/entities/merchant_profile.dart';

// Repository provider
final merchantRegistrationRepositoryProvider = Provider<MerchantRegistrationRepository>((ref) {
  final merchantService = ref.read(merchantServiceProvider);
  return MerchantRegistrationRepositoryImpl(merchantService);
});

// Use case provider
final registerMerchantUseCaseProvider = Provider<RegisterMerchantUseCase>((ref) {
  final repository = ref.read(merchantRegistrationRepositoryProvider);
  return RegisterMerchantUseCase(repository);
});

// State provider for merchant registration
final merchantRegistrationProvider = StateNotifierProvider<MerchantRegistrationNotifier, MerchantRegistrationState>((ref) {
  final registerMerchantUseCase = ref.read(registerMerchantUseCaseProvider);
  return MerchantRegistrationNotifier(registerMerchantUseCase);
});

// State notifier for merchant registration
class MerchantRegistrationNotifier extends StateNotifier<MerchantRegistrationState> {
  final RegisterMerchantUseCase _registerMerchantUseCase;

  MerchantRegistrationNotifier(this._registerMerchantUseCase) : super(const MerchantRegistrationState());

  Future<void> registerMerchant(Map<String, dynamic> merchantData) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      // Convert merchantData to MerchantProfile entity
      final merchantProfile = MerchantProfile.fromJson(merchantDataJson(merchantData);
      await _registerMerchantUseCase(merchantProfile);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }
}

// State for merchant registration
class MerchantRegistrationState {
  final bool isLoading;
  final String? error;

  const MerchantRegistrationState({
    this.isLoading = false,
    this.error,
  });

  MerchantRegistrationState copyWith({
    bool? isLoading,
    String? error,
  }) {
    return MerchantRegistrationState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}
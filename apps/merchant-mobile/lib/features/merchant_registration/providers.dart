import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/services/merchant_service.dart';
import 'package:merchant_mobile/features/merchant_registration/data/repository/merchant_registration_repository_impl.dart';
import 'package:merchant_mobile/features/merchant_registration/domain/repositories/merchant_registration_repository.dart';
import 'package:merchant_mobile/features/merchant_presentation/usecases/register_merchant_usecase.dart';

final merchantRegistrationRepositoryProvider =
    Provider<MerchantRegistrationRepository>((ref) {
      final merchantService = ref.read(merchantServiceProvider);
      return MerchantRegistrationRepositoryImpl(merchantService);
    });

// Provider for the use case
final registerMerchantUseCaseProvider = Provider<RegisterMerchantUseCase>((
  ref,
) {
  final repository = ref.read(merchantRegistrationRepositoryProvider);
  return RegisterMerchantUseCase(repository);
});

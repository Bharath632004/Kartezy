import 'package:merchant_mobile/core/services/merchant_service.dart';
import 'package:merchant_mobile/features/merchant_registration/domain/entities/merchant_profile.dart';
import 'package:merchant_mobile/features/merchant_registration/domain/repositories/merchant_registration_repository.dart';

class MerchantRegistrationRepositoryImpl
    implements MerchantRegistrationRepository {
  final MerchantService _merchantService;

  MerchantRegistrationRepositoryImpl(this._merchantService);

  @override
  Future<void> registerMerchant(MerchantProfile merchantProfile) async {
    await _merchantService.registerMerchant(merchantProfile.toJson());
  }
}

import 'package:merchant_mobile/features/merchant_registration/domain/entities/merchant_profile.dart';

abstract class MerchantRegistrationRepository {
  Future<void> registerMerchant(MerchantProfile merchantProfile);
}
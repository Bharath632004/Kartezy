import 'package:dartz/dartz.dart';
import 'package:merchant_mobile/features/merchant_registration/domain/entities/merchant_profile.dart';
import 'package:merchant_mobile/features/merchant_registration/domain/repositories/merchant_registration_repository.dart';

class RegisterMerchantUseCase {
  final MerchantRegistrationRepository repository;

  RegisterMerchantUseCase(this.repository);

  Future<Either<Exception, Unit>> call(MerchantProfile merchantProfile) async {
    try {
      await repository.registerMerchant(merchantProfile);
      return const Right(unit);
    } on Exception catch (e) {
      return Left(e);
    }
  }
}

import 'package:customer_mobile/features/tracking/domain/repository/tracking_repository.dart';
import 'package:customer_mobile/features/tracking/domain/models/driver_info.dart';
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/core/error/failures.dart';

class GetDriverInfoUseCase {
  final TrackingRepository repository;

  GetDriverInfoUseCase(this.repository);

  Future<Either<Failure, DriverInfo>> call(String orderId) async {
    try {
      final driver = await repository.getDriverInfo(orderId);
      return Right(driver);
    } catch (e) {
      return Left(Failure(message: e.toString()));
    }
  }
}

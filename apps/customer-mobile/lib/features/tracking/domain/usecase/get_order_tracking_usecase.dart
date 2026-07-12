import 'package:customer_mobile/features/tracking/domain/repository/tracking_repository.dart';
import 'package:customer_mobile/features/tracking/domain/models/tracking_info.dart';
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/core/error/failures.dart';

class GetOrderTrackingUseCase {
  final TrackingRepository repository;

  GetOrderTrackingUseCase(this.repository);

  Stream<Either<Failure, TrackingInfo>> call(String orderId) async* {
    try {
      await for (final tracking in repository.getOrderTracking(orderId)) {
        yield Right(tracking);
      }
    } catch (e) {
      yield Left(Failure(message: e.toString()));
    }
  }
}

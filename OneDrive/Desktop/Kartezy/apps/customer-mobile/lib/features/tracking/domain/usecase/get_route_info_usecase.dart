import 'package:customer_mobile/features/tracking/domain/repository/tracking_repository.dart';
import 'package:customer_mobile/features/tracking/domain/models/route_info.dart';
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/core/error/failures.dart';

class GetRouteInfoUseCase {
  final TrackingRepository repository;

  GetRouteInfoUseCase(this.repository);

  Future<Either<Failure, RouteInfo>> call(String orderId) async {
    try {
      final route = await repository.getRouteInfo(orderId);
      return Right(route);
    } catch (e) {
      return Left(UnexpectedFailure(message: e.toString()));
    }
  }
}

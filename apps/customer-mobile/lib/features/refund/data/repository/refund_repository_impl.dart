import 'package:customer_mobile/features/refund/data/datasource/refund_remote_data_source.dart';
import 'package:customer_mobile/features/refund/domain/repository/refund_repository.dart';

class RefundRepositoryImpl implements RefundRepository {
  final RefundRemoteDataSource remoteDataSource;

  RefundRepositoryImpl(this.remoteDataSource);

  @override
  Future<Map<String, dynamic>> getRefundStatus(String orderId) async {
    return await remoteDataSource.getRefundStatus(orderId);
  }

  @override
  Future<Map<String, dynamic>> requestRefund(
    String orderId,
    String reason,
  ) async {
    return await remoteDataSource.requestRefund(orderId, reason);
  }
}

import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';
import 'package:customer_mobile/shared/models/order.dart';

class PlaceOrderUseCase {
  final CheckoutRepository repository;

  PlaceOrderUseCase(this.repository);

  Future<Order> call(Map<String, dynamic> orderData) =>
      repository.placeOrder(orderData);
}

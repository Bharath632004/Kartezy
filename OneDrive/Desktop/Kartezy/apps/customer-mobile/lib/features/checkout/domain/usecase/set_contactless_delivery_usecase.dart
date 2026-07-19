import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';

class SetContactlessDeliveryUseCase {
  final CheckoutRepository repository;

  SetContactlessDeliveryUseCase(this.repository);

  Future<void> call(bool value) => repository.setContactlessDelivery(value);
}

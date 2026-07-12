import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';

class SetInstantDeliveryUseCase {
  final CheckoutRepository repository;

  SetInstantDeliveryUseCase(this.repository);

  Future<void> call(bool value) => repository.setInstantDelivery(value);
}

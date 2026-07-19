import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';

class SetScheduledDeliveryUseCase {
  final CheckoutRepository repository;

  SetScheduledDeliveryUseCase(this.repository);

  Future<void> call(DateTime dateTime) =>
      repository.setScheduledDelivery(dateTime);
}

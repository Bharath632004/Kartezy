import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';

class SelectDeliverySlotUseCase {
  final CheckoutRepository repository;

  SelectDeliverySlotUseCase(this.repository);

  Future<void> call(String slot) => repository.selectDeliverySlot(slot);
}

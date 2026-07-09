import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';

class SetDeliveryInstructionsUseCase {
  final CheckoutRepository repository;

  SetDeliveryInstructionsUseCase(this.repository);

  Future<void> call(String instructions) =>
      repository.setDeliveryInstructions(instructions);
}

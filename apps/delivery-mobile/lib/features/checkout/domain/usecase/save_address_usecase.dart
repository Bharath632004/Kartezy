import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';
import 'package:customer_mobile/shared/models/address.dart';

class SaveAddressUseCase {
  final CheckoutRepository repository;

  SaveAddressUseCase(this.repository);

  Future<Address> call(Address address) =>
      repository.saveAddress(address);
}

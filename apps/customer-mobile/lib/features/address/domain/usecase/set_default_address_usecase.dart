import 'package:customer_mobile/features/address/domain/repository/address_repository.dart';
import 'package:customer_mobile/shared/models/address.dart';

class SetDefaultAddressUseCase {
  final AddressRepository repository;

  SetDefaultAddressUseCase(this.repository);

  Future<Address> call(String addressId) =>
      repository.setDefaultAddress(addressId);
}

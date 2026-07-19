import 'package:customer_mobile/features/address/domain/repository/address_repository.dart';
import 'package:customer_mobile/shared/models/address.dart';

class UpdateAddressUseCase {
  final AddressRepository repository;

  UpdateAddressUseCase(this.repository);

  Future<Address> call(String addressId, Address address) =>
      repository.updateAddress(addressId, address);
}

import 'package:customer_mobile/features/address/domain/repository/address_repository.dart';
import 'package:customer_mobile/shared/models/address.dart';

class AddAddressUseCase {
  final AddressRepository repository;

  AddAddressUseCase(this.repository);

  Future<Address> call(Address address) => repository.addAddress(address);
}
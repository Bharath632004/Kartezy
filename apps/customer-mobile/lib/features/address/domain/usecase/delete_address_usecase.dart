import 'package:customer_mobile/features/address/domain/repository/address_repository.dart';

class DeleteAddressUseCase {
  final AddressRepository repository;

  DeleteAddressUseCase(this.repository);

  Future<void> call(String addressId) => repository.deleteAddress(addressId);
}
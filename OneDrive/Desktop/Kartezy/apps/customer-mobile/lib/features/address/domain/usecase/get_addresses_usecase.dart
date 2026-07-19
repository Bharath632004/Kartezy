import 'package:customer_mobile/features/address/domain/repository/address_repository.dart';
import 'package:customer_mobile/shared/models/address.dart';

class GetAddressesUseCase {
  final AddressRepository repository;

  GetAddressesUseCase(this.repository);

  Future<List<Address>> call(String? userId) => repository.getAddresses(userId);
}

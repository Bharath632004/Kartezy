import 'package:customer_mobile/features/address/data/datasource/address_remote_data_source.dart';
import 'package:customer_mobile/features/address/domain/repository/address_repository.dart';
import 'package:customer_mobile/shared/models/address.dart';

class AddressRepositoryImpl implements AddressRepository {
  final AddressRemoteDataSource _remoteDataSource;

  AddressRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Address>> getAddresses(String? userId) =>
      _remoteDataSource.getAddresses(userId);

  @override
  Future<Address> addAddress(Address address) =>
      _remoteDataSource.addAddress(address);

  @override
  Future<Address> updateAddress(String addressId, Address address) =>
      _remoteDataSource.updateAddress(addressId, address);

  @override
  Future<void> deleteAddress(String addressId) =>
      _remoteDataSource.deleteAddress(addressId);

  @override
  Future<Address> setDefaultAddress(String addressId) =>
      _remoteDataSource.setDefaultAddress(addressId);
}

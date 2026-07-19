import 'package:customer_mobile/shared/models/address.dart';

abstract class AddressRepository {
  Future<List<Address>> getAddresses(String? userId);
  Future<Address> addAddress(Address address);
  Future<Address> updateAddress(String addressId, Address address);
  Future<void> deleteAddress(String addressId);
  Future<Address> setDefaultAddress(String addressId);
}

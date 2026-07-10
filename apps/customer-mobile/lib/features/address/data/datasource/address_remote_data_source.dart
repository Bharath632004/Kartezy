import 'package:customer_mobile/shared/models/address.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class AddressRemoteDataSource {
  Future<List<Address>> getAddresses(String? userId);
  Future<Address> addAddress(Address address);
  Future<Address> updateAddress(String addressId, Address address);
  Future<void> deleteAddress(String addressId);
  Future<Address> setDefaultAddress(String addressId);
}

class AddressRemoteDataSourceImpl implements AddressRemoteDataSource {
  final Ref _ref;

  AddressRemoteDataSourceImpl(this._ref);

  @override
  Future<List<Address>> getAddresses(String? userId) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.get(
      '/addresses',
      queryParameters: {
        'userId': ?userId,
      },
    );
    final List<dynamic> data = response.data;
    return data.map((json) => Address.fromJson(json)).toList();
  }

  @override
  Future<Address> addAddress(Address address) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.post(
      '/addresses',
      data: address.toJson(),
    );
    return Address.fromJson(response.data);
  }

  @override
  Future<Address> updateAddress(String addressId, Address address) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.put(
      '/addresses/$addressId',
      data: address.toJson(),
    );
    return Address.fromJson(response.data);
  }

  @override
  Future<void> deleteAddress(String addressId) async {
    final dioClient = _ref.read(dioProvider);
    await dioClient.delete('/addresses/$addressId');
  }

  @override
  Future<Address> setDefaultAddress(String addressId) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.post(
      '/addresses/$addressId/set-default',
    );
    return Address.fromJson(response.data);
  }
}
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/address/data/datasource/address_remote_data_source.dart';
import 'package:customer_mobile/features/address/data/repository/address_repository_impl.dart';
import 'package:customer_mobile/features/address/domain/repository/address_repository.dart';
import 'package:customer_mobile/features/address/domain/usecase/get_addresses_usecase.dart';
import 'package:customer_mobile/features/address/domain/usecase/add_address_usecase.dart';
import 'package:customer_mobile/features/address/domain/usecase/update_address_usecase.dart';
import 'package:customer_mobile/features/address/domain/usecase/delete_address_usecase.dart';
import 'package:customer_mobile/features/address/domain/usecase/set_default_address_usecase.dart';
import 'package:customer_mobile/core/network/dio_client.dart';

// Providers for data source and repository
final addressRemoteDataSourceProvider = Provider<AddressRemoteDataSource>((ref) {
  return AddressRemoteDataSourceImpl(ref);
});

final addressRepositoryProvider = Provider<AddressRepository>((ref) {
  final remoteDataSource = ref.read(addressRemoteDataSourceProvider);
  return AddressRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final getAddressesUseCaseProvider = Provider<GetAddressesUseCase>((ref) {
  final repository = ref.read(addressRepositoryProvider);
  return GetAddressesUseCase(repository);
});

final addAddressUseCaseProvider = Provider<AddAddressUseCase>((ref) {
  final repository = ref.read(addressRepositoryProvider);
  return AddAddressUseCase(repository);
});

final updateAddressUseCaseProvider = Provider<UpdateAddressUseCase>((ref) {
  final repository = ref.read(addressRepositoryProvider);
  return UpdateAddressUseCase(repository);
});

final deleteAddressUseCaseProvider = Provider<DeleteAddressUseCase>((ref) {
  final repository = ref.read(addressRepositoryProvider);
  return DeleteAddressUseCase(repository);
});

final setDefaultAddressUseCaseProvider = Provider<SetDefaultAddressUseCase>((ref) {
  final repository = ref.read(addressRepositoryProvider);
  return SetDefaultAddressUseCase(repository);
});

// State notifier for address state
class AddressState {
  final List<Address> addresses;
  final bool isLoading;
  final String? errorMessage;

  const AddressState({
    this.addresses = const [],
    this.isLoading = false,
    this.errorMessage,
  });

  AddressState copyWith({
    List<Address>? addresses,
    bool? isLoading,
    String? errorMessage,
  }) {
    return AddressState(
      addresses: addresses ?? this.addresses,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class AddressNotifier extends StateNotifier<AddressState> {
  final GetAddressesUseCase _getAddressesUseCase;
  final AddAddressUseCase _addAddressUseCase;
  final UpdateAddressUseCase _updateAddressUseCase;
  final DeleteAddressUseCase _deleteAddressUseCase;
  final SetDefaultAddressUseCase _setDefaultAddressUseCase;

  AddressNotifier({
    required GetAddressesUseCase getAddressesUseCase,
    required AddAddressUseCase addAddressUseCase,
    required UpdateAddressUseCase updateAddressUseCase,
    required DeleteAddressUseCase deleteAddressUseCase,
    required SetDefaultAddressUseCase setDefaultAddressUseCase,
  }) : _getAddressesUseCase = getAddressesUseCase,
        _addAddressUseCase = addAddressUseCase,
        _updateAddressUseCase = updateAddressUseCase,
        _deleteAddressUseCase = deleteAddressUseCase,
        _setDefaultAddressUseCase = setDefaultAddressUseCase,
        super(const AddressState());

  Future<void> fetchAddresses(String? userId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final addresses = await _getAddressesUseCase(userId);
      state = state.copyWith(addresses: addresses, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> addAddress(Address address) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final newAddress = await _addAddressUseCase(address);
      state = state.copyWith(
        addresses: [...state.addresses, newAddress],
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> updateAddress(String addressId, Address address) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final updatedAddress = await _updateAddressUseCase(addressId, address);
      final updatedAddresses = state.addresses.map((addr) =>
          addr.id == addressId ? updatedAddress : addr).toList();
      state = state.copyWith(
        addresses: updatedAddresses,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> deleteAddress(String addressId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _deleteAddressUseCase(addressId);
      state = state.copyWith(
        addresses: state.addresses.where((addr) => addr.id != addressId).toList(),
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> setDefaultAddress(String addressId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final updatedAddress = await _setDefaultAddressUseCase(addressId);
      final updatedAddresses = state.addresses.map((addr) =>
          addr.id == addressId ? updatedAddress : addr).toList();
      state = state.copyWith(
        addresses: updatedAddresses,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

// Provider for the AddressNotifier
final addressProvider = StateNotifierProvider<AddressNotifier, AddressState>((ref) {
  return AddressNotifier(
    getAddressesUseCase: ref.read(getAddressesUseCaseProvider),
    addAddressUseCase: ref.read(addAddressUseCaseProvider),
    updateAddressUseCase: ref.read(updateAddressUseCaseProvider),
    deleteAddressUseCase: ref.read(deleteAddressUseCaseProvider),
    setDefaultAddressUseCase: ref.read(setDefaultAddressUseCaseProvider),
  );
});
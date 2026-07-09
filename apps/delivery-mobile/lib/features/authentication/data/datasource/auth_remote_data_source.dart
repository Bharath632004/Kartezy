// lib/features/authentication/data/datasource/auth_remote_data_source.dart
import 'package:delivery_mobile/shared/models/user.dart';
import 'package:delivery_mobile/core/providers/network_provider.dart';
import 'package:delivery_mobile/core/api/api_constants.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class AuthRemoteDataSource {
  Future<User> login(String email, String password);
  Future<void> logout();
  Future<User> refreshToken(String refreshToken);
  Future<User> sendOtp(String phoneNumber);
  Future<User> verifyOtp(String phoneNumber, String otp);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Ref _ref;

  AuthRemoteDataSourceImpl(this._ref);

  @override
  Future<User> login(String email, String password) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post(
      ApiConstants.deliveryPartnerAuthLogin,
      data: {'email': email, 'password': password},
    );
    return User.fromJson(response.data);
  }

  @override
  Future<void> logout() async {
    final dio = _ref.read(dioProvider);
    await dio.post(ApiConstants.deliveryPartnerAuthLogout);
  }

  @override
  Future<User> refreshToken(String refreshToken) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post(
      ApiConstants.deliveryPartnerAuthRefresh,
      data: {'refresh_token': refreshToken},
    );
    return User.fromJson(response.data);
  }

  @override
  Future<User> sendOtp(String phoneNumber) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post(
      ApiConstants.deliveryPartnerAuthSendOtp,
      data: {'phone_number': phoneNumber},
    );
    return User.fromJson(response.data);
  }

  @override
  Future<User> verifyOtp(String phoneNumber, String otp) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post(
      ApiConstants.deliveryPartnerAuthVerifyOtp,
      data: {'phone_number': phoneNumber, 'otp': otp},
    );
    return User.fromJson(response.data);
  }
}

/// Provider for auth remote data source
final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  return AuthRemoteDataSourceImpl(ref);
});

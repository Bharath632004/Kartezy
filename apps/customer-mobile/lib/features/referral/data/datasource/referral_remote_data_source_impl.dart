// lib/features/referral/data/datasource/referral_remote_data_source_impl.dart
import 'package:customer_mobile/core/network/api_constants.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:customer_mobile/features/referral/data/datasource/referral_remote_data_source.dart';
import 'package:customer_mobile/features/referral/domain/entities/referral.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';

class ReferralRemoteDataSourceImpl implements ReferralRemoteDataSource {
  final DioClient _dioClient;
  final Ref _ref;

  ReferralRemoteDataSourceImpl(this._ref) : _dioClient = DioClient();

  @override
  Future<Referral> getReferralCode() async {
    try {
      final response = await _dioClient.get(ApiConstants.getReferralCode);
      return Referral.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to get referral code: ${e.message}');
    }
  }

  @override
  Future<void> shareReferralCode(String code, String method) async {
    try {
      await _dioClient.post(
        ApiConstants.shareReferralCode,
        data: {'code': code, 'method': method},
      );
    } on DioException catch (e) {
      throw Exception('Failed to share referral code: ${e.message}');
    }
  }

  @override
  Future<List<Referral>> getReferralHistory() async {
    try {
      final response = await _dioClient.get(ApiConstants.getReferralHistory);
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => Referral.fromJson(json)).toList();
    } on DioException catch (e) {
      throw Exception('Failed to get referral history: ${e.message}');
    }
  }

  @override
  Future<bool> validateReferralCode(String code) async {
    try {
      final response = await _dioClient.get(
        '${ApiConstants.validateReferralCode}/$code',
      );
      return response.data['valid'] as bool;
    } on DioException catch (e) {
      throw Exception('Failed to validate referral code: ${e.message}');
    }
  }
}

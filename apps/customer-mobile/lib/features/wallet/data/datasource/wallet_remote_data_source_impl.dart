// lib/features/wallet/data/datasource/wallet_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/wallet.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class WalletRemoteDataSourceImpl {
  final Dio _dio;

  WalletRemoteDataSourceImpl(this._dio);

  Future<Wallet> getWallet() async {
    final response = await _dio.get('/wallet');
    return Wallet.fromJson(response.data);
  }

  Future<double> getBalance() async {
    final wallet = await getWallet();
    return wallet.balance;
  }

  Future<void> addMoney(double amount) async {
    await _dio.post('/wallet/topup', data: {'amount': amount});
  }

  Future<void> withdrawMoney(double amount) async {
    await _dio.post('/wallet/withdraw', data: {'amount': amount});
  }
}

/// Provider for wallet remote data source
final walletRemoteDataSourceProvider = Provider<WalletRemoteDataSourceImpl>((ref) {
  final dio = ref.read(dioProvider);
  return WalletRemoteDataSourceImpl(dio);
});

// lib/features/earnings_wallet/data/datasource/wallet_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:delivery_mobile/shared/models/wallet.dart';
import 'package:kartezy_core/providers/network_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class WalletRemoteDataSource {
  final Dio _dio;

  WalletRemoteDataSource(this._dio);

  Future<Wallet> getWallet() async {
    final response = await _dio.get('/wallet');
    return Wallet.fromJson(response.data);
  }

  Future<double> getBalance() async {
    final wallet = await getWallet();
    return wallet.balance;
  }
}

/// Provider for wallet remote data source
final walletRemoteDataSourceProvider = Provider<WalletRemoteDataSource>((ref) {
  final dio = ref.read(dioProvider);
  return WalletRemoteDataSource(dio);
});

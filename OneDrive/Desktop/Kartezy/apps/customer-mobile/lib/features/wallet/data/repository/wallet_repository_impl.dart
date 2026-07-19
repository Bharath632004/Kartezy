// lib/features/wallet/data/repository/wallet_repository_impl.dart
import 'package:customer_mobile/features/wallet/data/datasource/wallet_remote_data_source_impl.dart';
import 'package:customer_mobile/features/wallet/domain/repository/wallet_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class WalletRepositoryImpl implements WalletRepository {
  final WalletRemoteDataSourceImpl _remoteDataSource;

  WalletRepositoryImpl(this._remoteDataSource);

  @override
  Future<double> getBalance() async {
    return await _remoteDataSource.getBalance();
  }

  @override
  Future<void> addMoney(double amount) async {
    await _remoteDataSource.addMoney(amount);
  }

  @override
  Future<void> withdrawMoney(double amount) async {
    await _remoteDataSource.withdrawMoney(amount);
  }
}

/// Provider for wallet repository
final walletRepositoryProvider = Provider<WalletRepository>((ref) {
  final remoteDataSource = ref.read(walletRemoteDataSourceProvider);
  return WalletRepositoryImpl(remoteDataSource);
});

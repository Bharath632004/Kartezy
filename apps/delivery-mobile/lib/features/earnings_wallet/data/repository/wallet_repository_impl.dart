// lib/features/earnings_wallet/data/repository/wallet_repository_impl.dart
import 'package:delivery_mobile/features/earnings_wallet/data/datasource/wallet_remote_data_source.dart';
import 'package:delivery_mobile/features/earnings_wallet/domain/repository/wallet_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class WalletRepositoryImpl implements WalletRepository {
  final WalletRemoteDataSource _remoteDataSource;

  WalletRepositoryImpl(this._remoteDataSource);

  @override
  Future<double> getBalance() async {
    return await _remoteDataSource.getBalance();
  }
}

/// Provider for wallet repository
final walletRepositoryProvider = Provider<WalletRepository>((ref) {
  final remoteDataSource = ref.read(walletRemoteDataSourceProvider);
  return WalletRepositoryImpl(remoteDataSource);
});

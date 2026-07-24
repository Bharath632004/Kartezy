import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:delivery_mobile/features/earnings_wallet/data/datasource/wallet_remote_data_source.dart';
import 'package:delivery_mobile/features/earnings_wallet/data/repository/wallet_repository_impl.dart';
import 'package:delivery_mobile/features/earnings_wallet/domain/repository/wallet_repository.dart';
import 'package:delivery_mobile/features/earnings_wallet/domain/usecase/get_wallet_balance_use_case.dart';
import 'package:kartezy_core/providers/network_provider.dart';

// Providers for data source and repository
final walletRemoteDataSourceProvider = Provider<WalletRemoteDataSource>((ref) {
  final dioClient = ref.read(dioProvider);
  return WalletRemoteDataSource(dioClient);
});

final walletRepositoryProvider = Provider<WalletRepository>((ref) {
  final remoteDataSource = ref.read(walletRemoteDataSourceProvider);
  return WalletRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final getWalletBalanceUseCaseProvider = Provider<GetWalletBalanceUseCase>((
  ref,
) {
  final repository = ref.read(walletRepositoryProvider);
  return GetWalletBalanceUseCase(repository);
});

final addWalletMoneyUseCaseProvider = Provider<GetWalletBalanceUseCase>((ref) {
  final repository = ref.read(walletRepositoryProvider);
  return GetWalletBalanceUseCase(repository);
});

final withdrawWalletMoneyUseCaseProvider = Provider<GetWalletBalanceUseCase>((
  ref,
) {
  final repository = ref.read(walletRepositoryProvider);
  return GetWalletBalanceUseCase(repository);
});

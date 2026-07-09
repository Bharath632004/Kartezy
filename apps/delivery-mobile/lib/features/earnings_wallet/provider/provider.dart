import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:delivery_mobile/features/earnings_wallet/data/datasource/wallet_remote_data_source.dart';
import 'package:delivery_mobile/features/earnings_wallet/data/repository/wallet_repository_impl.dart';
import 'package:delivery_mobile/features/earnings_wallet/domain/repository/wallet_repository.dart';
import 'package:delivery_mobile/features/earnings_wallet/domain/usecase/get_wallet_balance_usecase.dart';
import 'package:delivery_mobile/features/earnings_wallet/domain/usecase/add_wallet_money_usecase.dart';
import 'package:delivery_mobile/features/earnings_wallet/domain/usecase/withdraw_wallet_money_usecase.dart';
import 'package:kartezy_core/core/network/dio_client.dart';
import 'package:kartezy_core/core/providers/network_provider.dart';

// Providers for data source and repository
final walletRemoteDataSourceProvider = Provider<WalletRemoteDataSource>((ref) {
  final dioClient = ref.read(dioProvider);
  return WalletRemoteDataSourceImpl(dioClient);
});

final walletRepositoryProvider = Provider<WalletRepository>((ref) {
  final remoteDataSource = ref.read(walletRemoteDataSourceProvider);
  return WalletRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final getWalletBalanceUseCaseProvider = Provider<GetWalletBalanceUseCase>((ref) {
  final repository = ref.read(walletRepositoryProvider);
  return GetWalletBalanceUseCase(repository);
});

final addWalletMoneyUseCaseProvider = Provider<AddWalletMoneyUseCase>((ref) {
  final repository = ref.read(walletRepositoryProvider);
  return AddWalletMoneyUseCase(repository);
});

final withdrawWalletMoneyUseCaseProvider = Provider<WithdrawWalletMoneyUseCase>((ref) {
  final repository = ref.read(walletRepositoryProvider);
  return WithdrawWalletMoneyUseCase(repository);
});
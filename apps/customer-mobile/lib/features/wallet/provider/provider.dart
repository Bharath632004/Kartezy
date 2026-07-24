import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/wallet/data/datasource/wallet_remote_data_source_impl.dart';
import 'package:customer_mobile/features/wallet/data/repository/wallet_repository_impl.dart';
import 'package:customer_mobile/features/wallet/domain/repository/wallet_repository.dart';
import 'package:customer_mobile/features/wallet/domain/usecase/get_wallet_balance_use_case.dart';
import 'package:customer_mobile/features/wallet/domain/usecase/add_wallet_money_use_case.dart';
import 'package:customer_mobile/features/wallet/domain/usecase/withdraw_wallet_money_use_case.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

// Providers for data source and repository
final walletRemoteDataSourceProvider = Provider<WalletRemoteDataSourceImpl>((
  ref,
) {
  final dioClient = ref.read(dioProvider);
  return WalletRemoteDataSourceImpl(dioClient);
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

final addWalletMoneyUseCaseProvider = Provider<AddWalletMoneyUseCase>((ref) {
  final repository = ref.read(walletRepositoryProvider);
  return AddWalletMoneyUseCase(repository);
});

final withdrawWalletMoneyUseCaseProvider = Provider<WithdrawWalletMoneyUseCase>(
  (ref) {
    final repository = ref.read(walletRepositoryProvider);
    return WithdrawWalletMoneyUseCase(repository);
  },
);

// Wallet transaction entry
class WalletTransactionEntry {
  final String id;
  final String type;
  final String description;
  final double amount;
  final String category;
  final String createdAt;

  const WalletTransactionEntry({
    required this.id,
    required this.type,
    required this.description,
    required this.amount,
    this.category = '',
    this.createdAt = '',
  });
}

// Wallet state
class WalletState {
  final double balance;
  final List<WalletTransactionEntry> transactions;
  final bool isLoading;
  final String? errorMessage;

  const WalletState({
    this.balance = 0.0,
    this.transactions = const [],
    this.isLoading = false,
    this.errorMessage,
  });

  WalletState copyWith({
    double? balance,
    List<WalletTransactionEntry>? transactions,
    bool? isLoading,
    String? errorMessage,
  }) {
    return WalletState(
      balance: balance ?? this.balance,
      transactions: transactions ?? this.transactions,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class WalletNotifier extends StateNotifier<WalletState> {
  final GetWalletBalanceUseCase _getWalletBalanceUseCase;
  final AddWalletMoneyUseCase _addWalletMoneyUseCase;
  final WithdrawWalletMoneyUseCase _withdrawWalletMoneyUseCase;

  WalletNotifier({
    required this._getWalletBalanceUseCase,
    required this._addWalletMoneyUseCase,
    required this._withdrawWalletMoneyUseCase,
  }) : super(const WalletState());

  Future<void> fetchWallet() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final balance = await _getWalletBalanceUseCase();
      state = state.copyWith(balance: balance, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> addMoney(double amount) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _addWalletMoneyUseCase(amount);
      await fetchWallet();
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> withdraw(double amount) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _withdrawWalletMoneyUseCase(amount);
      await fetchWallet();
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

final walletProvider = StateNotifierProvider<WalletNotifier, WalletState>((
  ref,
) {
  return WalletNotifier(
    getWalletBalanceUseCase: ref.read(getWalletBalanceUseCaseProvider),
    addWalletMoneyUseCase: ref.read(addWalletMoneyUseCaseProvider),
    withdrawWalletMoneyUseCase: ref.read(withdrawWalletMoneyUseCaseProvider),
  );
});

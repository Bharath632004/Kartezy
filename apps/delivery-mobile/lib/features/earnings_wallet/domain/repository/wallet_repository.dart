// lib/features/earnings_wallet/domain/repository/wallet_repository.dart
abstract class WalletRepository {
  Future<double> getBalance();
}

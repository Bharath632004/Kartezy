// lib/features/earnings_wallet/domain/repository/wallet_repository.dart
import 'package:delivery_mobile/shared/models/wallet.dart';

abstract class WalletRepository {
  Future<double> getBalance();
}

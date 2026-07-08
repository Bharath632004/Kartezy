// lib/features/wallet/domain/repository/wallet_repository.dart
import 'package:customer_mobile/shared/models/wallet.dart';

abstract class WalletRepository {
  Future<double> getBalance();
}
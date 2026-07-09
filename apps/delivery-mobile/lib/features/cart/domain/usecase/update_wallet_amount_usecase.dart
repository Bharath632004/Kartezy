// lib/features/cart/domain/usecase/update_wallet_amount_usecase.dart
import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class UpdateWalletAmountUseCase {
  final CartRepository repository;

  UpdateWalletAmountUseCase(this.repository);

  Future<Cart> call(double amount) async {
    return await repository.updateWalletAmount(amount);
  }
}
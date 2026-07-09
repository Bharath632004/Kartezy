import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class UpdateCartItemQuantityUseCase {
  final CartRepository repository;

  UpdateCartItemQuantityUseCase(this.repository);

  Future<Cart> call(String cartItemId, int quantity) =>
      repository.updateCartItemQuantity(cartItemId, quantity);
}
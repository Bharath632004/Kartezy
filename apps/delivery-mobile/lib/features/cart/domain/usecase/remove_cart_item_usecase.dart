import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class RemoveCartItemUseCase {
  final CartRepository repository;

  RemoveCartItemUseCase(this.repository);

  Future<Cart> call(String cartItemId) => repository.removeCartItem(cartItemId);
}
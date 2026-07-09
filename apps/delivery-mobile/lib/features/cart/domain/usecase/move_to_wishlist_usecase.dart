import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class MoveToWishlistUseCase {
  final CartRepository repository;

  MoveToWishlistUseCase(this.repository);

  Future<Cart> call(String cartItemId) => repository.moveToWishlist(cartItemId);
}
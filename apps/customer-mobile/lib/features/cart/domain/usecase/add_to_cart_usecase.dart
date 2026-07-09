import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class AddToCartUseCase {
  final CartRepository repository;

  AddToCartUseCase(this.repository);

  Future<Cart> call(String productId, int quantity, Map<String, String> variants) =>
      repository.addToCart(productId, quantity, variants);
}
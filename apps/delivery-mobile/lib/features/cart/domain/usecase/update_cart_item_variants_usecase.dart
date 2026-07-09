import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class UpdateCartItemVariantsUseCase {
  final CartRepository repository;

  UpdateCartItemVariantsUseCase(this.repository);

  Future<Cart> call(String cartItemId, Map<String, String> variants) =>
      repository.updateCartItemVariants(cartItemId, variants);
}
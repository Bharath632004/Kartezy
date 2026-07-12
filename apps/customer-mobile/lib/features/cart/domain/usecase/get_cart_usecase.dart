import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class GetCartUseCase {
  final CartRepository repository;

  GetCartUseCase(this.repository);

  Future<Cart> call(String? userId) => repository.getCart(userId);
}

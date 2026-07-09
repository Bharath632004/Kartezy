import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class MergeGuestCartUseCase {
  final CartRepository repository;

  MergeGuestCartUseCase(this.repository);

  Future<Cart> call(String guestCartId, String userId) =>
      repository.mergeGuestCart(guestCartId, userId);
}
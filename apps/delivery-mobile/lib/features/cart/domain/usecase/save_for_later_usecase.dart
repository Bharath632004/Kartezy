// lib/features/cart/domain/usecase/save_for_later_usecase.dart
import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class SaveForLaterUseCase {
  final CartRepository repository;

  SaveForLaterUseCase(this.repository);

  Future<Cart> call(String cartItemId) async {
    return await repository.saveForLater(cartItemId);
  }
}
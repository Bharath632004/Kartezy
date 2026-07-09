import 'package:customer_mobile/features/cart/domain/usecase/get_cart_usecase.dart';

class GetCheckoutSummaryUseCase {
  final GetCartUseCase _getCartUseCase;

  GetCheckoutSummaryUseCase(this._getCartUseCase);

  Future<Cart> call([String? userId]) => _getCartUseCase(userId);
}
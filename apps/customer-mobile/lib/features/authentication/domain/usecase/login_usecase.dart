// lib/features/authentication/domain/usecase/login_usecase.dart
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:customer_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/authentication/provider/provider.dart';
import 'package:customer_mobile/features/cart/domain/usecase/merge_guest_cart_usecase.dart';
import 'package:hive/hive.dart';

class LoginUseCase {
  final AuthRepository _repository;
  final Ref _ref;

  LoginUseCase(this._repository, this._ref);

  Future<User> call(String email, String password) async {
    final user = await _repository.login(email, password);
    // Merge guest cart if exists
    await _mergeGuestCartAfterLogin(user.id);
    return user;
  }

  Future<void> _mergeGuestCartAfterLogin(String userId) async {
    try {
      final box = await Hive.openBox<String>('guestCart');
      final guestCartId = box.get('cartId');
      if (guestCartId != null && guestCartId.isNotEmpty) {
        final mergeGuestCartUseCase = _ref.read(mergeGuestCartUseCaseProvider);
        await mergeGuestCartUseCase(guestCartId, userId);
        await box.delete('cartId');
      }
    } catch (e) {
      // Ignore errors in merging cart
    }
  }
}

/// Provider for login use case
final loginUseCaseProvider = Provider<LoginUseCase>((ref) {
  final repository = ref.read(authRepositoryProvider);
  return LoginUseCase(repository, ref);
});
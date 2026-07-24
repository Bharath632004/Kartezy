// lib/features/authentication/domain/usecase/login_usecase.dart
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:customer_mobile/features/authentication/domain/models/login_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/authentication/provider/provider.dart';
import 'package:customer_mobile/features/cart/provider/provider.dart';
import 'package:hive/hive.dart';

class LoginUseCase {
  final AuthRepository _repository;
  final Ref _ref;

  LoginUseCase(this._repository, this._ref);

  /// Returns a [LoginResponse] which may indicate MFA is required.
  Future<LoginResponse> call(String email, String password) async {
    final response = await _repository.login(email, password);

    // If MFA is required, return the response so the UI can handle it
    if (response.mfaRequired) {
      return response;
    }

    // Otherwise proceed with guest cart merge
    if (response.user != null) {
      await _mergeGuestCartAfterLogin(response.user!.id);
    }
    return response;
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

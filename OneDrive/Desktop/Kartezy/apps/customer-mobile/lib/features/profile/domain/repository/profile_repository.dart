// lib/features/profile/domain/repository/profile_repository.dart
import 'package:customer_mobile/shared/models/user.dart';

abstract class ProfileRepository {
  Future<User> getProfile();
}

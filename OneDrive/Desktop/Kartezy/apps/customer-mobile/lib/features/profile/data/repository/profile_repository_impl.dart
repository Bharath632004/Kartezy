// lib/features/profile/data/repository/profile_repository_impl.dart
import 'package:customer_mobile/features/profile/data/datasource/profile_remote_data_source.dart';
import 'package:customer_mobile/features/profile/domain/repository/profile_repository.dart';
import 'package:customer_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  final ProfileRemoteDataSource _remoteDataSource;

  ProfileRepositoryImpl(this._remoteDataSource);

  @override
  Future<User> getProfile() async {
    return await _remoteDataSource.getProfile();
  }
}

/// Provider for profile repository
final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  final remoteDataSource = ref.read(profileRemoteDataSourceProvider);
  return ProfileRepositoryImpl(remoteDataSource);
});

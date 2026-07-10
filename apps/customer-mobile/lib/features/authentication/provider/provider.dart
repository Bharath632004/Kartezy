// lib/features/authentication/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/authentication/data/datasource/auth_remote_data_source.dart';
import 'package:customer_mobile/features/authentication/data/repository/auth_repository_impl.dart';
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';

// Provider for auth remote data source
final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  return AuthRemoteDataSourceImpl(ref);
});

// Provider for auth repository
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final remoteDataSource = ref.read(authRemoteDataSourceProvider);
  return AuthRepositoryImpl(ref);
});

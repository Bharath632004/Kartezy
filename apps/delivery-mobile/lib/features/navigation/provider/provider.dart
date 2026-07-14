// lib/features/navigation/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:delivery_mobile/features/navigation/data/datasource/navigation_remote_data_source.dart';
import 'package:delivery_mobile/features/navigation/data/repository/navigation_repository_impl.dart';
import 'package:delivery_mobile/features/navigation/domain/repository/navigation_repository.dart';
import 'package:delivery_mobile/features/navigation/domain/usecase/cancel_navigation_request_use_case.dart';
import 'package:delivery_mobile/features/navigation/domain/usecase/get_directions_use_case.dart';
import 'package:delivery_mobile/features/navigation/domain/usecase/get_current_location_use_case.dart';
import 'package:delivery_mobile/features/navigation/domain/usecase/get_location_stream_use_case.dart';
import 'package:kratezy_core/core/providers/network_provider.dart';

// Providers for data source and repository
final navigationRemoteDataSourceProvider = Provider<NavigationRemoteDataSource>(
  (ref) {
    final dio = ref.read(dioProvider);
    return NavigationRemoteDataSource(dio);
  },
);

final navigationRepositoryProvider = Provider<NavigationRepository>((ref) {
  final remoteDataSource = ref.read(navigationRemoteDataSourceProvider);
  return NavigationRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final getDirectionsUseCaseProvider = Provider<GetDirectionsUseCase>((ref) {
  final repository = ref.read(navigationRepositoryProvider);
  return GetDirectionsUseCase(repository);
});

final getCurrentLocationUseCaseProvider = Provider<GetCurrentLocationUseCase>((
  ref,
) {
  final repository = ref.read(navigationRepositoryProvider);
  return GetCurrentLocationUseCase(repository);
});

final getLocationStreamUseCaseProvider = Provider<GetLocationStreamUseCase>((
  ref,
) {
  final repository = ref.read(navigationRepositoryProvider);
  return GetLocationStreamUseCase(repository);
});

final cancelNavigationRequestUseCaseProvider =
    Provider<CancelNavigationRequestUseCase>((ref) {
      final repository = ref.read(navigationRepositoryProvider);
      return CancelNavigationRequestUseCase(repository);
    });

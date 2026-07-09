import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/tracking/domain/models/tracking_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/driver_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/route_info.dart';
import 'package:customer_mobile/features/tracking/domain/usecase/get_order_tracking_usecase.dart';
import 'package:customer_mobile/features/tracking/domain/usecase/get_driver_info_usecase.dart';
import 'package:customer_mobile/features/tracking/domain/usecase/get_route_info_usecase.dart';
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/core/error/failures.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

class TrackingState {
  final bool isLoading;
  final TrackingInfo? value;
  final String? error;

  const TrackingState({
    this.isLoading = false,
    this.value,
    this.error,
  });

  bool get hasError => error != null;

  TrackingState copyWith({
    bool? isLoading,
    TrackingInfo? value,
    String? error,
  }) {
    return TrackingState(
      isLoading: isLoading ?? this.isLoading,
      value: value ?? this.value,
      error: error ?? this.error,
    );
  }
}

class TrackingNotifier extends StateNotifier<TrackingState> {
  final GetOrderTrackingUseCase _getOrderTrackingUseCase;
  StreamSubscription<Either<Failure, TrackingInfo>>? _subscription;

  TrackingNotifier(this._getOrderTrackingUseCase) : super(const TrackingState());

  void startTracking(String orderId) {
    state = state.copyWith(isLoading: true, error: null);
    _subscription?.cancel();
    _subscription = _getOrderTrackingUseCase(orderId).listen((either) {
      either.fold(
        (failure) => state = state.copyWith(isLoading: false, error: failure.message),
        (trackingInfo) => state = state.copyWith(isLoading: false, value: trackingInfo, error: null),
      );
    });
  }

  void stopTracking() {
    _subscription?.cancel();
    state = const TrackingState();
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}

// Provider for the tracking notifier
final trackingProvider = StateNotifierProvider<TrackingNotifier, TrackingState>((ref) {
  return TrackingNotifier(
    ref.read(getOrderTrackingUseCaseProvider),
  );
});

// Provider for the use case
final getOrderTrackingUseCaseProvider = Provider<GetOrderTrackingUseCase>((ref) {
  return GetOrderTrackingUseCase(
    ref.read(trackingRepositoryProvider),
  );
});

// Now DriverProvider
class DriverState {
  final bool isLoading;
  final DriverInfo? value;
  final String? error;

  const DriverState({
    this.isLoading = false,
    this.value,
    this.error,
  });

  bool get hasError => error != null;

  DriverState copyWith({
    bool? isLoading,
    DriverInfo? value,
    String? error,
  }) {
    return DriverState(
      isLoading: isLoading ?? this.isLoading,
      value: value ?? this.value,
      error: error ?? this.error,
    );
  }
}

class DriverNotifier extends StateNotifier<DriverState> {
  final GetDriverInfoUseCase _getDriverInfoUseCase;

  DriverNotifier(this._getDriverInfoUseCase) : super(const DriverState());

  Future<void> loadDriverInfo(String orderId) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _getDriverInfoUseCase(orderId);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (driverInfo) => state = state.copyWith(isLoading: false, value: driverInfo),
    );
  }
}

// Provider for the driver notifier
final driverProvider = StateNotifierProvider<DriverNotifier, DriverState>((ref) {
  return DriverNotifier(
    ref.read(getDriverInfoUseCaseProvider),
  );
});

// Provider for the use case
final getDriverInfoUseCaseProvider = Provider<GetDriverInfoUseCase>((ref) {
  return GetDriverInfoUseCase(
    ref.read(trackingRepositoryProvider),
  );
});

// Now RouteProvider
class RouteState {
  final bool isLoading;
  final RouteInfo? value;
  final String? error;

  const RouteState({
    this.isLoading = false,
    this.value,
    this.error,
  });

  bool get hasError => error != null;

  RouteState copyWith({
    bool? isLoading,
    RouteInfo? value,
    String? error,
  }) {
    return RouteState(
      isLoading: isLoading ?? this.isLoading,
      value: value ?? this.value,
      error: error ?? this.error,
    );
  }
}

class RouteNotifier extends StateNotifier<RouteState> {
  final GetRouteInfoUseCase _getRouteInfoUseCase;

  RouteNotifier(this._getRouteInfoUseCase) : super(const RouteState());

  Future<void> loadRouteInfo(String orderId) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _getRouteInfoUseCase(orderId);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (routeInfo) => state = state.copyWith(isLoading: false, value: routeInfo),
    );
  }
}

// Provider for the route notifier
final routeProvider = StateNotifierProvider<RouteNotifier, RouteState>((ref) {
  return RouteNotifier(
    ref.read(getRouteInfoUseCaseProvider),
  );
});

// Provider for the use case
final getRouteInfoUseCaseProvider = Provider<GetRouteInfoUseCase>((ref) {
  return GetRouteInfoUseCase(
    ref.read(trackingRepositoryProvider),
  );
});

// Repository provider
final trackingRepositoryProvider = Provider<TrackingRepository>((ref) {
  return TrackingRepositoryImpl(
    ref.read(trackingRemoteDataSourceProvider),
  );
});

// Remote data source provider
final trackingRemoteDataSourceProvider = Provider<TrackingRemoteDataSource>((ref) {
  return TrackingRemoteDataSourceImpl(
    ref.read(dioProvider),
  );
});
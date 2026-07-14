// lib/features/order_management/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:delivery_mobile/features/order_management/data/datasource/order_remote_data_source.dart';
import 'package:delivery_mobile/features/order_management/data/repository/order_repository_impl.dart';
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/accept_order_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/get_available_orders_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/reject_order_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/deliver_order_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/get_order_history_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/get_order_timeline_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/pickup_order_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/submit_proof_of_delivery_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/verify_otp_use_case.dart';
import 'package:kartezy_core/core/providers/network_provider.dart';

// Providers for data source and repository
final orderRemoteDataSourceProvider = Provider<OrderRemoteDataSource>((ref) {
  final dioClient = ref.read(dioProvider);
  return OrderRemoteDataSource(dioClient);
});

final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  final remoteDataSource = ref.read(orderRemoteDataSourceProvider);
  return OrderRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final getAvailableOrdersUseCaseProvider = Provider<GetAvailableOrdersUseCase>((
  ref,
) {
  final repository = ref.read(orderRepositoryProvider);
  return GetAvailableOrdersUseCase(repository);
});

final acceptOrderUseCaseProvider = Provider<AcceptOrderUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return AcceptOrderUseCase(repository);
});

final rejectOrderUseCaseProvider = Provider<RejectOrderUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return RejectOrderUseCase(repository);
});

final pickupOrderUseCaseProvider = Provider<PickupOrderUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return PickupOrderUseCase(repository);
});

final verifyOtpUseCaseProvider = Provider<VerifyOtpUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return VerifyOtpUseCase(repository);
});

final deliverOrderUseCaseProvider = Provider<DeliverOrderUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return DeliverOrderUseCase(repository);
});

final submitProofOfDeliveryUseCaseProvider =
    Provider<SubmitProofOfDeliveryUseCase>((ref) {
      final repository = ref.read(orderRepositoryProvider);
      return SubmitProofOfDeliveryUseCase(repository);
    });

final getOrderHistoryUseCaseProvider = Provider<GetOrderHistoryUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return GetOrderHistoryUseCase(repository);
});

final getOrderTimelineUseCaseProvider = Provider<GetOrderTimelineUseCase>((
  ref,
) {
  final repository = ref.read(orderRepositoryProvider);
  return GetOrderTimelineUseCase(repository);
});

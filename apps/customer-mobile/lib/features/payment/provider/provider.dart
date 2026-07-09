import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/payment/data/datasource/payment_remote_data_source.dart';
import 'package:customer_mobile/features/payment/data/repository/payment_repository_impl.dart';
import 'package:customer_mobile/features/payment/domain/repository/payment_repository.dart';
import 'package:customer_mobile/features/payment/domain/usecase/initiate_payment_usecase.dart';
import 'package:customer_mobile/features/payment/domain/usecase/get_payment_usecase.dart';
import 'package:customer_mobile/features/payment/domain/usecase/refund_payment_usecase.dart';
import 'package:customer_mobile/features/payment/domain/usecase/get_payments_by_order_usecase.dart';
import 'package:customer_mobile/features/payment/domain/usecase/get_user_payments_usecase.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:customer_mobile/shared/models/payment.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

// Providers for data source and repository
final paymentRemoteDataSourceProvider = Provider<PaymentRemoteDataSource>((ref) {
  final dioClient = ref.read(dioProvider);
  return PaymentRemoteDataSourceImpl(dioClient);
});

final paymentRepositoryProvider = Provider<PaymentRepository>((ref) {
  final remoteDataSource = ref.read(paymentRemoteDataSourceProvider);
  return PaymentRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final initiatePaymentUseCaseProvider = Provider<InitiatePaymentUseCase>((ref) {
  final repository = ref.read(paymentRepositoryProvider);
  return InitiatePaymentUseCase(repository);
});

final getPaymentUseCaseProvider = Provider<GetPaymentUseCase>((ref) {
  final repository = ref.read(paymentRepositoryProvider);
  return GetPaymentUseCase(repository);
});

final refundPaymentUseCaseProvider = Provider<RefundPaymentUseCase>((ref) {
  final repository = ref.read(paymentRepositoryProvider);
  return RefundPaymentUseCase(repository);
});

final getPaymentsByOrderUseCaseProvider = Provider<GetPaymentsByOrderUseCase>((ref) {
  final repository = ref.read(paymentRepositoryProvider);
  return GetPaymentsByOrderUseCase(repository);
});

final getUserPaymentsUseCaseProvider = Provider<GetUserPaymentsUseCase>((ref) {
  final repository = ref.read(paymentRepositoryProvider);
  return GetUserPaymentsUseCase(repository);
});

// State notifier for payment state
class PaymentState {
  final Payment? currentPayment;
  final List<Payment> payments;
  final bool isLoading;
  final String? errorMessage;

  const PaymentState({
    this.currentPayment,
    this.payments = const [],
    this.isLoading = false,
    this.errorMessage,
  });

  PaymentState copyWith({
    Payment? currentPayment,
    List<Payment>? payments,
    bool? isLoading,
    String? errorMessage,
  }) {
    return PaymentState(
      currentPayment: currentPayment ?? this.currentPayment,
      payments: payments ?? this.payments,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class PaymentNotifier extends StateNotifier<PaymentState> {
  final InitiatePaymentUseCase _initiatePaymentUseCase;
  final GetPaymentUseCase _getPaymentUseCase;
  final RefundPaymentUseCase _refundPaymentUseCase;
  final GetPaymentsByOrderUseCase _getPaymentsByOrderUseCase;
  final GetUserPaymentsUseCase _getUserPaymentsUseCase;

  PaymentNotifier({
    required InitiatePaymentUseCase initiatePaymentUseCase,
    required GetPaymentUseCase getPaymentUseCase,
    required RefundPaymentUseCase refundPaymentUseCase,
    required GetPaymentsByOrderUseCase getPaymentsByOrderUseCase,
    required GetUserPaymentsUseCase getUserPaymentsUseCase,
  }) : _initiatePaymentUseCase = initiatePaymentUseCase,
        _getPaymentUseCase = getPaymentUseCase,
        _refundPaymentUseCase = refundPaymentUseCase,
        _getPaymentsByOrderUseCase = getPaymentsByOrderUseCase,
        _getUserPaymentsUseCase = getUserPaymentsUseCase,
        super(const PaymentState());

  Future<void> initiatePayment(Map<String, dynamic> paymentData) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final payment = await _initiatePaymentUseCase(paymentData);
      state = state.copyWith(
        currentPayment: payment,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> getPayment(String paymentId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final payment = await _getPaymentUseCase(paymentId);
      state = state.copyWith(
        currentPayment: payment,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> refundPayment(String paymentId, double? amount) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final payment = await _refundPaymentUseCase(paymentId, amount);
      // Update the current payment if it's the one being refunded
      state = state.copyWith(
        currentPayment: state.currentPayment?.id == paymentId ? payment : state.currentPayment,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> getPaymentsByOrder(String orderId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final payments = await _getPaymentsByOrderUseCase(orderId);
      state = state.copyWith(
        payments: payments,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> getUserPayments(String? userId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final payments = await _getUserPaymentsUseCase(userId);
      state = state.copyWith(
        payments: payments,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

// Provider for the PaymentNotifier
final paymentProvider = StateNotifierProvider<PaymentNotifier, PaymentState>((ref) {
  return PaymentNotifier(
    initiatePaymentUseCase: ref.read(initiatePaymentUseCaseProvider),
    getPaymentUseCase: ref.read(getPaymentUseCaseProvider),
    refundPaymentUseCase: ref.read(refundPaymentUseCaseProvider),
    getPaymentsByOrderUseCase: ref.read(getPaymentsByOrderUseCaseProvider),
    getUserPaymentsUseCase: ref.read(getUserPaymentsUseCaseProvider),
  );
});
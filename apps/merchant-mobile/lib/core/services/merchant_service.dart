import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/dio_client.dart';
import '../api/api_constants.dart';
import '../error/exceptions.dart';

final merchantServiceProvider = Provider<MerchantService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return MerchantService(dioClient);
});

class MerchantService {
  final DioClient _dioClient;

  MerchantService(this._dioClient);

  Dio get _dio => _dioClient.getInstance();

  Future<void> registerMerchant(Map<String, dynamic> merchantData) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.merchantRegister}',
        data: merchantData,
      );
      return response.data;
    } catch (e) {
      throw Exception('Merchant registration failed: $e');
    }
  }

  Future<Map<String, dynamic>> getMerchantProfile() async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.merchantProfile}',
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch merchant profile: $e');
    }
  }

  Future<void> updateMerchantProfile(Map<String, dynamic> profileData) async {
    try {
      final response = await _dio.put(
        '${ApiConstants.baseUrl}/${ApiConstants.merchantUpdateProfile}',
        data: profileData,
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to update merchant profile: $e');
    }
  }

  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.dashboardStats}',
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch dashboard stats: $e');
    }
  }
}

// Provider for merchant state
final merchantStateProvider = StateNotifierProvider<MerchantStateNotifier, MerchantState>((ref) {
  return MerchantStateNotifier(ref.read(merchantServiceProvider));
});

class MerchantStateNotifier extends StateNotifier<MerchantState> {
  final MerchantService _merchantService;
  MerchantStateNotifier(this._merchantService) : super(MerchantState.initial());

  Future<void> registerMerchant(Map<String, dynamic> merchantData) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _merchantService.registerMerchant(merchantData);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      rethrow;
    }
  }

  Future<void> fetchMerchantProfile() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final profile = await _merchantService.getMerchantProfile();
      state = state.copyWith(
        isLoading: false,
        merchantProfile: profile,
        approvalStatus: profile['approval_status'] ?? 'pending',
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> updateMerchantProfile(Map<String, dynamic> profileData) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _merchantService.updateMerchantProfile(profileData);
      // Fetch updated profile
      await fetchMerchantProfile();
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> fetchDashboardStats() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final stats = await _merchantService.getDashboardStats();
      state = state.copyWith(isLoading: false, dashboardStats: stats);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }
}

class MerchantState {
  final bool isLoading;
  final String? error;
  final Map<String, dynamic>? merchantProfile;
  final String? approvalStatus;
  final Map<String, dynamic>? dashboardStats;

  MerchantState({
    required this.isLoading,
    this.error,
    this.merchantProfile,
    this.approvalStatus,
    this.dashboardStats,
  });

  factory MerchantState.initial() => MerchantState(
        isLoading: false,
      );

  MerchantState copyWith({
    bool? isLoading,
    String? error,
    Map<String, dynamic>? merchantProfile,
    String? approvalStatus,
    Map<String, dynamic>? dashboardStats,
  }) {
    return MerchantState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      merchantProfile: merchantProfile ?? this.merchantProfile,
      approvalStatus: approvalStatus ?? this.approvalStatus,
      dashboardStats: dashboardStats ?? this.dashboardStats,
    );
  }
}
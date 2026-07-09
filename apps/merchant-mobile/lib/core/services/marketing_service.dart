import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../api/dio_client.dart';
import '../../api/api_constants.dart';

final marketingServiceProvider = Provider<MarketingService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return MarketingService(dioClient);
});

class MarketingService {
  final DioClient _dioClient;

  MarketingService(this._dioClient);

  Dio get _dio => _dioClient.instance;

  // Sponsored Products
  Future<List<Map<String, dynamic>>> getSponsoredProducts({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.marketingSponsoredProducts}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch sponsored products: $e');
    }
  }

  // Featured Products
  Future<List<Map<String, dynamic>>> getFeaturedProducts({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.marketingFeaturedProducts}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch featured products: $e');
    }
  }

  // Banner Campaigns
  Future<List<Map<String, dynamic>>> getBannerCampaigns({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.marketingBannerCampaigns}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch banner campaigns: $e');
    }
  }

  // Seasonal Campaigns
  Future<List<Map<String, dynamic>>> getSeasonalCampaigns({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.marketingSeasonalCampaigns}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch seasonal campaigns: $e');
    }
  }

  // Festival Campaigns
  Future<List<Map<String, dynamic>>> getFestivalCampaigns({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.marketingFestivalCampaigns}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch festival campaigns: $e');
    }
  }

  // Push Campaigns
  Future<List<Map<String, dynamic>>> getPushCampaigns({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.marketingPushCampaigns}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch push campaigns: $e');
    }
  }

  // Email Campaigns
  Future<List<Map<String, dynamic>>> getEmailCampaigns({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.marketingEmailCampaigns}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch email campaigns: $e');
    }
  }

  // SMS Campaigns
  Future<List<Map<String, dynamic>>> getSmsCampaigns({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.marketingSmsCampaigns}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch sms campaigns: $e');
    }
  }

  // Create Sponsored Product
  Future<Map<String, dynamic>> createSdynamic<String, dynamic>> createSponsoredProduct(Map<String, dynamic> sponsoredProductData) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.marketingSponsoredProducts}',
        data: sponsoredProductData,
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to create sponsored product: $e');
    }
  }

  // Update Sponsored Product
  Future<Map<String, dynamic>> updateSponsoredProduct(String id, Map<String, dynamic> sponsoredProductData) async {
    try {
      final response = await _dio.put(
        '${ApiConstants.baseUrl}${ApiConstants.marketingSponsoredProducts}/$id',
        data: sponsoredProductData,
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to update sponsored product: $e');
    }
  }

  // Delete Sponsored Product
  Future<void> deleteSponsoredProduct(String id) async {
    try {
      await _dio.delete(
        '${ApiConstants.baseUrl}${ApiConstants.marketingSponsoredProducts}/$id',
      );
    } catch (e) {
      throw Exception('Failed to delete sponsored product: $e');
    }
  }
}
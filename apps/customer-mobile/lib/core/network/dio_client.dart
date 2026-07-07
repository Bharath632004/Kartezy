// lib/core/network/dio_client.dart
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

import 'package:customer_mobile/core/config/app_constants.dart';

/// Dio client with interceptors for logging, authentication, and error handling.
class DioClient {
  DioClient._internal();

  static final DioClient _instance = DioClient._internal();

  factory DioClient() => _instance;

  late Dio _dio;

  Dio get instance => _dio;

  void initialize() {
    final baseUrl = AppConstants.baseUrl;

    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add logging interceptor in debug mode
    if (kDebugMode) {
      _dio.interceptors.add(PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        compact: true,
        maxWidth: 90,
      ));
    }

    // Add authentication interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // TODO: Add token from secure storage
        // final token = await _secureStorage.read(key: 'accessToken');
        // if (token != null) {
        //   options.headers['Authorization'] = 'Bearer $token';
        // }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        // Handle common errors (e.g., 401, 403) and retry logic can be added here
        return handler.next(e); // Continue propagation
      },
    ));

    // Add retry policy using dio_smart_retry
    // _dio.interceptors.add(RetryInterceptor(dio: _dio));
  }
}

/// Provider for Dio client
final dioProvider = Provider<Dio>((ref) {
  // Ensure initialization
  final dioClient = DioClient();
  dioClient.initialize();
  return dioClient.instance;
});
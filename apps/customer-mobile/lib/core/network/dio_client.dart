import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

import 'package:customer_mobile/core/config/app_constants.dart';
import 'package:customer_mobile/core/services/auth_service.dart';

class DioClient {
  DioClient(this._ref);

  final Ref _ref;

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
      _dio.interceptors.add(
        PrettyDioLogger(
          requestHeader: true,
          requestBody: true,
          responseBody: true,
          responseHeader: false,
          compact: true,
          maxWidth: 90,
        ),
      );
    }

    // Add authentication interceptor
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final authService = _ref.read(authServiceProvider);
          final token = await authService.getAccessToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) async {
          // If we get a 401 and haven't already tried to refresh, attempt to refresh token
          if (e.response?.statusCode == 401) {
            final authService = _ref.read(authServiceProvider);
            final isRefreshed = await authService.refreshToken();
            if (isRefreshed) {
              // Retry the original request with the new token
              final opts = e.response?.requestOptions;
              if (opts != null) {
                try {
                  final response = await _dio.fetch<dynamic>(opts);
                  return handler.resolve(response);
                } catch (_) {
                  // If retry fails, let the original error go through
                  return handler.next(e);
                }
              }
            } else {
              // If refresh fails, log out the user
              await authService.logout();
            }
          }
          return handler.next(e);
        },
      ),
    );

    // Add retry policy using dio_smart_retry
    // _dio.interceptors.add(RetryInterceptor(dio: _dio));
  }
}

/// Provider for Dio client
final dioProvider = Provider<Dio>((ref) {
  final dioClient = DioClient(ref);
  dioClient.initialize();
  return dioClient.instance;
});

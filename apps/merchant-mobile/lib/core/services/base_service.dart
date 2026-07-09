import 'package:dio/dio.dart';
import '../services/auth_service.dart';

abstract class BaseService {
  final AuthService _authService;
  final DioClient _dioClient;

  BaseService(this._authService, this._dioClient);

  Future<T> safeCall<T>(Future<T> Function() apiCall) async {
    try {
      return await apiCall();
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        // Try to refresh token
        await _authService.refreshToken();
        // Retry the call
        return await apiCall();
      }
      rethrow;
    }
  }
}
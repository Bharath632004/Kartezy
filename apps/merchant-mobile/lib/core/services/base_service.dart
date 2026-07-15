import 'package:dio/dio.dart';
import 'package:merchant_mobile/core/services/auth_service.dart';
import 'package:merchant_mobile/core/api/dio_client.dart';

abstract class BaseService {
  final AuthService _authService;
  final DioClient _dioClient;

  BaseService(this._authService, this._dioClient);

  DioClient get dioClient => _dioClient;
}

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../network/dio_client.dart';

/// Provider for DioClient instance
final dioClientProvider = Provider<DioClient>((ref) {
  return DioClient(ref: ref);
});

/// Provider for Dio instance
final dioProvider = Provider<Dio>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return dioClient.dio;
});

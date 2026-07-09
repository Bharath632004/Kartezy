// lib/features/tracking/data/datasource/tracking_remote_data_source_impl.dart
import 'package:customer_mobile/features/tracking/data/datasource.dart';
import 'package:customer_mobile/features/tracking/tracking_remote_data_source.dart';
import 'package:customer_mobile/features/tracking/domain/models/driver_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/route_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/tracking_info.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:dio/dio.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'dart:convert';
import 'dart:async';

class TrackingRemoteDataSourceImpl implements TrackingRemoteDataSource {
  final DioClient dioClient;

  TrackingRemoteDataSourceImpl(this.dioClient);

  @override
  Stream<TrackingInfo> getOrderTracking(String orderId) async* {
    try {
      final response = await dioClient.dio.get(
        '/tracking/$orderId',
        options: Options(
          responseType: StreamType,
          followRedirects: false,
          validateStatus: (status) => true,
        ),
      );

      await for (var event in response.data.stream
          .transform(utf8.decoder)
          .transform(const LineSplitter())) {
        if (event.isNotEmpty) {
          try {
            final Map<String, dynamic> json = jsonDecode(event);
            yield TrackingInfo.fromJson(json);
          } catch (_) {
            // Skip invalid JSON lines
          }
        }
      }
    } catch (e) {
      // Re-throw as a stream error
      yield* Stream.error(e);
    }
  }

  @override
  Future<DriverInfo> getDriverInfo(String orderId) async {
    final response = await dioClient.dio.get('/delivery/$orderId/driver');
    return DriverInfo.fromJson(response.data);
  }

  @override
  Future<RouteInfo> getRouteInfo(String orderId) async {
    final response = await dioClient.dio.get('/delivery/$orderId/route');
    return RouteInfo.fromJson(response.data);
  }
}
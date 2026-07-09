import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/dio_client.dart';
import '../api/api_constants.dart';
import '../models/inventory_model.dart';

final inventoryServiceProvider = Provider<InventoryService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return InventoryService(dioClient);
});

class InventoryService {
  final DioClient _dioClient;

  InventoryService(this._dioClient);

  Dio get _dio => _dioClient.instance;

  Future<List<InventoryModel>> getInventories({
    String? productId,
    String? warehouseId,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.inventory}',
        queryParameters: {
          'product_id': productId,
          'warehouse_id': warehouseId,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => InventoryModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Failed to fetch inventories: $e');
    }
  }

  Future<InventoryModel> getInventoryById(String inventoryId) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.inventory}/$inventoryId',
      );
      return InventoryModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to fetch inventory: $e');
    }
  }

  Future<InventoryModel> createInventory(InventoryModel inventory) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.inventory}',
        data: inventory.toJson(),
      );
      return InventoryModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to create inventory: $e');
    }
  }

  Future<InventoryModel> updateInventory(String inventoryId, InventoryModel inventory) async {
    try {
      final response = await _dio.put(
        '${ApiConstants.baseUrl}${ApiConstants.inventory}/$inventoryId',
        data: inventory.toJson(),
      );
      return InventoryModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to update inventory: $e');
    }
  }

  Future<void> deleteInventory(String inventoryId) async {
    try {
      await _dio.delete(
        '${ApiConstants.baseUrl}${ApiConstants.inventory}/$inventoryId',
      );
    } catch (e) {
      throw Exception('Failed to delete inventory: $e');
    }
  }

  // Additional methods for stock adjustment, transfer, etc.
  Future<InventoryModel> adjustStock(String inventoryId, int adjustment) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.inventory}/$inventoryId/adjust',
        data: {'adjustment': adjustment},
      );
      return InventoryModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to adjust stock: $e');
    }
  }

  Future<InventoryModel> transferStock(String fromInventoryId, String toInventoryId, int quantity) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.inventory}/transfer',
        data: {
          'from_inventory_id': fromInventoryId,
          'to_inventory_id': toInventoryId,
          'quantity': quantity,
        },
      );
      return InventoryModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to transfer stock: $e');
    }
  }
}
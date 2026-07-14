import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'inventory_service.dart';
import '../models/inventory_model.dart';

class InventoryState {
  final bool isLoading;
  final String? error;
  final List<InventoryModel> inventories;
  final InventoryModel? selectedInventory;
  final bool hasMore;
  final int page;

  const InventoryState({
    required this.isLoading,
    this.error,
    required this.inventories,
    this.selectedInventory,
    required this.hasMore,
    required this.page,
  });

  factory InventoryState.initial() => const InventoryState(
    isLoading: false,
    inventories: [],
    hasMore: false,
    page: 1,
  );

  InventoryState copyWith({
    bool? isLoading,
    String? error,
    List<InventoryModel>? inventories,
    InventoryModel? selectedInventory,
    bool? hasMore,
    int? page,
  }) {
    return InventoryState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      inventories: inventories ?? this.inventories,
      selectedInventory: selectedInventory ?? this.selectedInventory,
      hasMore: hasMore ?? this.hasMore,
      page: page ?? this.page,
    );
  }
}

class InventoryNotifier extends StateNotifier<InventoryState> {
  final InventoryService _inventoryService;

  InventoryNotifier(this._inventoryService) : super(InventoryState.initial());

  Future<void> fetchInventories({
    String? productId,
    String? warehouseId,
    int? page,
    int limit = 20,
  }) async {
    final currentPage = page ?? state.page;
    if (currentPage == 1) {
      state = state.copyWith(isLoading: true, error: null);
    }
    try {
      final inventories = await _inventoryService.getInventories(
        productId: productId,
        warehouseId: warehouseId,
        page: currentPage,
        limit: limit,
      );
      final hasMore = inventories.length == limit;
      state = state.copyWith(
        isLoading: false,
        inventories: currentPage == 1
            ? inventories
            : [...state.inventories, ...inventories],
        hasMore: hasMore,
        page: currentPage,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> fetchInventoryById(String inventoryId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final inventory = await _inventoryService.getInventoryById(inventoryId);
      state = state.copyWith(isLoading: false, selectedInventory: inventory);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> createInventory(InventoryModel inventory) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final newInventory = await _inventoryService.createInventory(inventory);
      state = state.copyWith(
        isLoading: false,
        inventories: [newInventory, ...state.inventories],
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> updateInventory(
    String inventoryId,
    InventoryModel inventory,
  ) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final updatedInventory = await _inventoryService.updateInventory(
        inventoryId,
        inventory,
      );
      state = state.copyWith(
        isLoading: false,
        inventories: state.inventories
            .map((inv) => inv.id == inventoryId ? updatedInventory : inv)
            .toList(),
        selectedInventory: state.selectedInventory?.id == inventoryId
            ? updatedInventory
            : state.selectedInventory,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> deleteInventory(String inventoryId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _inventoryService.deleteInventory(inventoryId);
      state = state.copyWith(
        isLoading: false,
        inventories: state.inventories
            .where((inv) => inv.id != inventoryId)
            .toList(),
        selectedInventory: state.selectedInventory?.id == inventoryId
            ? null
            : state.selectedInventory,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> adjustStock(String inventoryId, int adjustment) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final updatedInventory = await _inventoryService.adjustStock(
        inventoryId,
        adjustment,
      );
      state = state.copyWith(
        isLoading: false,
        inventories: state.inventories
            .map((inv) => inv.id == inventoryId ? updatedInventory : inv)
            .toList(),
        selectedInventory: state.selectedInventory?.id == inventoryId
            ? updatedInventory
            : state.selectedInventory,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> transferStock(
    String fromInventoryId,
    String toInventoryId,
    int quantity,
  ) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      // This would update both inventories, but for simplicity we'll refetch
      await _inventoryService.transferStock(
        fromInventoryId,
        toInventoryId,
        quantity,
      );
      // In a real app, you might update the two inventories optimistically
      // For now, we'll just reset and refetch
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }
}

final inventoryNotifierProvider =
    StateNotifierProvider<InventoryNotifier, InventoryState>((ref) {
      return InventoryNotifier(ref.read(inventoryServiceProvider));
    });

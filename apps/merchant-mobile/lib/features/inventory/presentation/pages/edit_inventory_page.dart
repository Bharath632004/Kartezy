import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/core/models/inventory_model.dart';
import 'package:merchant_mobile/core/services/inventory_notifier.dart';

class EditInventoryPage extends ConsumerStatefulWidget {
  const EditInventoryPage({super.key});

  @override
  ConsumerState<EditInventoryPage> createState() => _EditInventoryPageState();
}

class _EditInventoryPageState extends ConsumerState<EditInventoryPage> {
  final _formKey = GlobalKey<FormState>();
  final _quantityController = TextEditingController();
  final _locationController = TextEditingController();
  bool _isLoading = true;
  bool _isSaving = false;
  String? _inventoryId;
  InventoryModel? _inventory;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_inventoryId == null) {
      _inventoryId = GoRouterState.of(context).extra as String?;
      if (_inventoryId != null) {
        _loadInventory();
      }
    }
  }

  void _loadInventory() {
    ref
        .read(inventoryNotifierProvider.notifier)
        .fetchInventoryById(_inventoryId!)
        .then((_) {
          final state = ref.read(inventoryNotifierProvider);
          if (state.selectedInventory != null && mounted) {
            setState(() {
              _inventory = state.selectedInventory;
              _quantityController.text =
                  state.selectedInventory!.quantity?.toString() ?? '';
              _locationController.text =
                  state.selectedInventory!.location ?? '';
              _isLoading = false;
            });
          }
        })
        .catchError((_) {
          if (mounted) setState(() => _isLoading = false);
        });
  }

  @override
  void dispose() {
    _quantityController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate() || _inventoryId == null) return;
    setState(() => _isSaving = true);
    try {
      final inventory = _inventory!.copyWith(
        quantity: int.tryParse(_quantityController.text),
        location: _locationController.text,
      );
      await ref
          .read(inventoryNotifierProvider.notifier)
          .updateInventory(_inventoryId!, inventory);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Inventory updated successfully')),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update inventory: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Inventory')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Product ID',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.inventory),
                      ),
                      initialValue: _inventory?.productId ?? '',
                      enabled: false,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Warehouse ID',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.warehouse),
                      ),
                      initialValue: _inventory?.warehouseId ?? '',
                      enabled: false,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _quantityController,
                      decoration: const InputDecoration(
                        labelText: 'Quantity',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.numbers),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'Required';
                        if (int.tryParse(v) == null) {
                          return 'Enter a valid number';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _locationController,
                      decoration: const InputDecoration(
                        labelText: 'Location',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.location_on),
                      ),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: _isSaving ? null : _save,
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(48),
                      ),
                      child: _isSaving
                          ? const CircularProgressIndicator(strokeWidth: 2)
                          : const Text('Update Inventory'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

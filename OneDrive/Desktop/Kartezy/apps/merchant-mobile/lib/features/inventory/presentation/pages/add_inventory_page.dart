import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/core/models/inventory_model.dart';
import 'package:merchant_mobile/core/services/inventory_notifier.dart';

class AddInventoryPage extends ConsumerStatefulWidget {
  const AddInventoryPage({super.key});

  @override
  ConsumerState<AddInventoryPage> createState() => _AddInventoryPageState();
}

class _AddInventoryPageState extends ConsumerState<AddInventoryPage> {
  final _formKey = GlobalKey<FormState>();
  final _productIdController = TextEditingController();
  final _warehouseIdController = TextEditingController();
  final _quantityController = TextEditingController();
  final _locationController = TextEditingController();
  bool _isSaving = false;

  @override
  void dispose() {
    _productIdController.dispose();
    _warehouseIdController.dispose();
    _quantityController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);
    try {
      final inventory = InventoryModel(
        productId: _productIdController.text,
        warehouseId: _warehouseIdController.text,
        quantity: int.tryParse(_quantityController.text) ?? 0,
        location: _locationController.text,
      );
      await ref.read(inventoryNotifierProvider.notifier).createInventory(inventory);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Inventory added successfully')),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to add inventory: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Inventory')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _productIdController,
                decoration: const InputDecoration(
                  labelText: 'Product ID',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.inventory),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _warehouseIdController,
                decoration: const InputDecoration(
                  labelText: 'Warehouse ID',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.warehouse),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
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
                  if (int.tryParse(v) == null) return 'Enter a valid number';
                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Location (e.g., Aisle, Shelf)',
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
                    : const Text('Add Inventory'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

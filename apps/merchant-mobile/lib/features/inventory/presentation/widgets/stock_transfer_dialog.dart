import 'package:flutter/material.dart';

/// A dialog for transferring stock between warehouses or locations.
class StockTransferDialog extends StatefulWidget {
  final String fromProductName;
  final String fromSku;
  final int currentQuantity;

  const StockTransferDialog({
    super.key,
    required this.fromProductName,
    required this.fromSku,
    required this.currentQuantity,
  });

  /// Shows the stock transfer dialog and returns the transfer data if confirmed.
  static Future<Map<String, dynamic>?> show(
    BuildContext context, {
    required String fromProductName,
    required String fromSku,
    required int currentQuantity,
  }) {
    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (ctx) => StockTransferDialog(
        fromProductName: fromProductName,
        fromSku: fromSku,
        currentQuantity: currentQuantity,
      ),
    );
  }

  @override
  State<StockTransferDialog> createState() => _StockTransferDialogState();
}

class _StockTransferDialogState extends State<StockTransferDialog> {
  final _formKey = GlobalKey<FormState>();
  final _quantityController = TextEditingController();
  String _transferType = 'warehouse'; // 'warehouse' or 'location'
  String _destinationWarehouse = '';
  String _destinationLocation = '';
  String _reason = '';

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AlertDialog(
      title: Row(
        children: [
          Icon(Icons.swap_horiz, color: theme.colorScheme.primary),
          const SizedBox(width: 8),
          const Text('Transfer Stock'),
        ],
      ),
      content: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: SizedBox(
            width: double.maxFinite,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Source product info
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.fromProductName,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'SKU: ${widget.fromSku}',
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                      Text(
                        'Available: ${widget.currentQuantity} units',
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Transfer type toggle
                SegmentedButton<String>(
                  segments: const [
                    ButtonSegment(
                      value: 'warehouse',
                      label: Text('To Warehouse'),
                      icon: Icon(Icons.warehouse, size: 18),
                    ),
                    ButtonSegment(
                      value: 'location',
                      label: Text('To Location'),
                      icon: Icon(Icons.location_on, size: 18),
                    ),
                  ],
                  selected: {_transferType},
                  onSelectionChanged: (value) {
                    setState(() => _transferType = value.first);
                  },
                ),
                const SizedBox(height: 16),

                // Destination
                if (_transferType == 'warehouse')
                  DropdownButtonFormField<String>(
                    initialValue: _destinationWarehouse.isEmpty
                        ? null
                        : _destinationWarehouse,
                    decoration: const InputDecoration(
                      labelText: 'Destination Warehouse',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.warehouse),
                    ),
                    items: const [
                      DropdownMenuItem(
                        value: 'WH-MAIN',
                        child: Text('Main Warehouse'),
                      ),
                      DropdownMenuItem(
                        value: 'WH-SECONDARY',
                        child: Text('Secondary Warehouse'),
                      ),
                      DropdownMenuItem(
                        value: 'WH-DARK-STORE',
                        child: Text('Dark Store A'),
                      ),
                    ],
                    onChanged: (value) {
                      setState(() => _destinationWarehouse = value ?? '');
                    },
                    validator: (value) =>
                        value == null ? 'Select a warehouse' : null,
                  )
                else
                  TextFormField(
                    decoration: const InputDecoration(
                      labelText: 'Destination Location (Aisle/Shelf)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.location_on),
                      hintText: 'e.g., A-12, Shelf-3',
                    ),
                    onChanged: (value) => _destinationLocation = value,
                    validator: (value) => value == null || value.isEmpty
                        ? 'Enter location'
                        : null,
                  ),
                const SizedBox(height: 16),

                // Quantity
                TextFormField(
                  controller: _quantityController,
                  decoration: const InputDecoration(
                    labelText: 'Quantity to Transfer',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.numbers),
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.isEmpty) return 'Required';
                    final qty = int.tryParse(value);
                    if (qty == null) return 'Enter a valid number';
                    if (qty <= 0) return 'Must be greater than 0';
                    if (qty > widget.currentQuantity) {
                      return 'Not enough stock (max: ${widget.currentQuantity})';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Reason
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Reason for Transfer',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.edit_note),
                    hintText: 'e.g., Replenish dark store',
                  ),
                  maxLines: 2,
                  onChanged: (value) => _reason = value,
                ),
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton.icon(
          onPressed: _confirmTransfer,
          icon: const Icon(Icons.swap_horiz, size: 18),
          label: const Text('Transfer'),
          style: ElevatedButton.styleFrom(
            backgroundColor: theme.colorScheme.primary,
            foregroundColor: Colors.white,
          ),
        ),
      ],
    );
  }

  void _confirmTransfer() {
    if (!_formKey.currentState!.validate()) return;

    final quantity = int.parse(_quantityController.text);
    final data = {
      'quantity': quantity,
      'type': _transferType,
      'destination': _transferType == 'warehouse'
          ? _destinationWarehouse
          : _destinationLocation,
      'reason': _reason,
      'timestamp': DateTime.now().toIso8601String(),
    };

    Navigator.pop(context, data);
  }
}

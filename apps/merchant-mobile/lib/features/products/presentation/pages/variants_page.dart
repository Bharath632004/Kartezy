import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Product variant model
class ProductVariant {
  final String id;
  final String name;
  final String sku;
  final String? barcode;
  final String? imageUrl;
  final double price;
  final double? mrp;
  final int stock;
  final Map<String, String>
  attributes; // e.g., {'Size': 'Large', 'Color': 'Red'}

  const ProductVariant({
    required this.id,
    required this.name,
    required this.sku,
    this.barcode,
    this.imageUrl,
    required this.price,
    this.mrp,
    required this.stock,
    this.attributes = const {},
  });
}

final productVariantsProvider = Provider<List<ProductVariant>>((ref) {
  return [
    ProductVariant(
      id: 'v1',
      name: 'Classic T-Shirt - Red / Large',
      sku: 'TSHIRT-CLS-RD-L',
      barcode: '8901234567890',
      price: 599,
      mrp: 799,
      stock: 25,
      attributes: {'Size': 'Large', 'Color': 'Red'},
    ),
    ProductVariant(
      id: 'v2',
      name: 'Classic T-Shirt - Red / Medium',
      sku: 'TSHIRT-CLS-RD-M',
      price: 599,
      mrp: 799,
      stock: 42,
      attributes: {'Size': 'Medium', 'Color': 'Red'},
    ),
    ProductVariant(
      id: 'v3',
      name: 'Classic T-Shirt - Blue / Large',
      sku: 'TSHIRT-CLS-BL-L',
      barcode: '8901234567891',
      price: 649,
      mrp: 849,
      stock: 0,
      attributes: {'Size': 'Large', 'Color': 'Blue'},
    ),
  ];
});

/// Product variants management page
class VariantsPage extends ConsumerStatefulWidget {
  final String productName;

  const VariantsPage({super.key, required this.productName});

  @override
  ConsumerState<VariantsPage> createState() => _VariantsPageState();
}

class _VariantsPageState extends ConsumerState<VariantsPage> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final variants = ref.watch(productVariantsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Variants'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddVariantDialog,
          ),
        ],
      ),
      body: variants.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.swap_calls, size: 64, color: Colors.grey[300]),
                  const SizedBox(height: 16),
                  Text(
                    'No variants for ${widget.productName}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Add size, color, or other variations',
                    style: TextStyle(color: Colors.grey[500], fontSize: 13),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: _showAddVariantDialog,
                    icon: const Icon(Icons.add),
                    label: const Text('Add Variant'),
                  ),
                ],
              ),
            )
          : RefreshIndicator(
              onRefresh: () async {},
              child: ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: variants.length + 1, // +1 for header
                itemBuilder: (context, index) {
                  if (index == 0) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Text(
                        '${variants.length} variants for ${widget.productName}',
                        style: TextStyle(color: Colors.grey[600], fontSize: 13),
                      ),
                    );
                  }
                  final variant = variants[index - 1];
                  return _buildVariantCard(theme, variant);
                },
              ),
            ),
    );
  }

  Widget _buildVariantCard(ThemeData theme, ProductVariant variant) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Variant attributes
                Expanded(
                  child: Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: variant.attributes.entries.map((attr) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '${attr.key}: ${attr.value}',
                          style: const TextStyle(fontSize: 12),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                // Stock indicator
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: variant.stock > 10
                        ? Colors.green.shade50
                        : variant.stock > 0
                        ? Colors.orange.shade50
                        : Colors.red.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${variant.stock} in stock',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: variant.stock > 10
                          ? Colors.green.shade700
                          : variant.stock > 0
                          ? Colors.orange.shade700
                          : Colors.red.shade700,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            // SKU and pricing
            Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'SKU: ${variant.sku}',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                    if (variant.barcode != null)
                      Text(
                        'Barcode: ${variant.barcode}',
                        style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                      ),
                  ],
                ),
                const Spacer(),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '₹${variant.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                    if (variant.mrp != null && variant.mrp! > variant.price)
                      Text(
                        'MRP: ₹${variant.mrp!.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey[500],
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),
            // Actions
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit, size: 16),
                  label: const Text('Edit', style: TextStyle(fontSize: 12)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.delete, size: 16),
                  label: const Text('Delete', style: TextStyle(fontSize: 12)),
                  style: TextButton.styleFrom(foregroundColor: Colors.red),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showAddVariantDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => _AddVariantSheet(productName: widget.productName),
    );
  }
}

class _AddVariantSheet extends StatefulWidget {
  final String productName;

  const _AddVariantSheet({required this.productName});

  @override
  State<_AddVariantSheet> createState() => _AddVariantSheetState();
}

class _AddVariantSheetState extends State<_AddVariantSheet> {
  final _formKey = GlobalKey<FormState>();
  final _skuController = TextEditingController();
  final _barcodeController = TextEditingController();
  final _priceController = TextEditingController();
  final _mrpController = TextEditingController();
  final _stockController = TextEditingController();
  String _selectedAttribute = 'Size';

  @override
  void dispose() {
    _skuController.dispose();
    _barcodeController.dispose();
    _priceController.dispose();
    _mrpController.dispose();
    _stockController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Add Variant for ${widget.productName}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 16),
              // Attribute selection
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      initialValue: _selectedAttribute,
                      decoration: const InputDecoration(
                        labelText: 'Attribute',
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'Size', child: Text('Size')),
                        DropdownMenuItem(value: 'Color', child: Text('Color')),
                        DropdownMenuItem(
                          value: 'Weight',
                          child: Text('Weight'),
                        ),
                        DropdownMenuItem(
                          value: 'Flavor',
                          child: Text('Flavor'),
                        ),
                      ],
                      onChanged: (value) {
                        setState(() => _selectedAttribute = value ?? 'Size');
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Value',
                        border: const OutlineInputBorder(),
                        hintText: 'e.g., Large',
                      ),
                      onChanged: (value) {
                        // Value captured by form field state
                      },
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _skuController,
                decoration: const InputDecoration(
                  labelText: 'SKU',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.tag, size: 20),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _barcodeController,
                decoration: const InputDecoration(
                  labelText: 'Barcode (optional)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.qr_code, size: 20),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _priceController,
                      decoration: const InputDecoration(
                        labelText: 'Price',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.currency_rupee, size: 20),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      controller: _mrpController,
                      decoration: const InputDecoration(
                        labelText: 'MRP',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _stockController,
                decoration: const InputDecoration(
                  labelText: 'Initial Stock',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.inventory, size: 20),
                ),
                keyboardType: TextInputType.number,
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Variant added successfully'),
                        ),
                      );
                    }
                  },
                  child: const Text('Add Variant'),
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }
}

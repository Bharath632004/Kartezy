import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/models/product_model.dart';
import 'package:merchant_mobile/core/services/product_notifier.dart';

class ProductForm extends ConsumerStatefulWidget {
  final ProductModel? initialProduct;

  const ProductForm({super.key, this.initialProduct});

  @override
  ConsumerState<ProductForm> createState() => _ProductFormState();
}

class _ProductFormState extends ConsumerState<ProductForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _skuController;
  late final TextEditingController _priceController;
  late final TextEditingController _mrpController;
  late final TextEditingController _discountController;
  late final TextEditingController _currencyController;
  late final TextEditingController _imageUrlController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(
      text: widget.initialProduct?.name ?? '',
    );
    _descriptionController = TextEditingController(
      text: widget.initialProduct?.description ?? '',
    );
    _skuController = TextEditingController(
      text: widget.initialProduct?.sku ?? '',
    );
    _priceController = TextEditingController(
      text: widget.initialProduct?.price?.toString() ?? '',
    );
    _mrpController = TextEditingController(
      text: widget.initialProduct?.mrp?.toString() ?? '',
    );
    _discountController = TextEditingController(
      text: widget.initialProduct?.discount?.toString() ?? '',
    );
    _currencyController = TextEditingController(text: 'INR');
    _imageUrlController = TextEditingController(
      text: widget.initialProduct?.imageUrl ?? '',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _skuController.dispose();
    _priceController.dispose();
    _mrpController.dispose();
    _discountController.dispose();
    _currencyController.dispose();
    _imageUrlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Product Name'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter product name';
                }
                return null;
              },
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(labelText: 'Description'),
              maxLines: 3,
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _skuController,
              decoration: const InputDecoration(labelText: 'SKU'),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _priceController,
              decoration: const InputDecoration(labelText: 'Price'),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter price';
                }
                if (double.tryParse(value) == null) {
                  return 'Please enter a valid number';
                }
                return null;
              },
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _mrpController,
              decoration: const InputDecoration(labelText: 'MRP'),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _discountController,
              decoration: const InputDecoration(labelText: 'Discount (%)'),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _currencyController,
              decoration: const InputDecoration(labelText: 'Currency'),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _imageUrlController,
              decoration: const InputDecoration(labelText: 'Image URL'),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  // Create or update product
                  final product = ProductModel(
                    id: widget.initialProduct?.id,
                    name: _nameController.text,
                    description: _descriptionController.text,
                    sku: _skuController.text,
                    price: double.tryParse(_priceController.text),
                    imageUrl: _imageUrlController.text.isEmpty
                        ? null
                        : _imageUrlController.text,
                    // Map other fields
                  );

                  if (widget.initialProduct == null) {
                    // Adding new product
                    ref
                        .read(productNotifierProvider.notifier)
                        .createProduct(product);
                  } else if (widget.initialProduct?.id != null) {
                    // Updating existing product
                    ref
                        .read(productNotifierProvider.notifier)
                        .updateProduct(widget.initialProduct!.id!, product);
                  }

                  // Navigate back
                  Navigator.of(context).pop();
                }
              },
              child: Text(
                widget.initialProduct == null
                    ? 'Add Product'
                    : 'Update Product',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

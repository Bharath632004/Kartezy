import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/core/services/product_notifier.dart';
import '../widgets/product_form.dart';

class EditProductPage extends ConsumerStatefulWidget {
  const EditProductPage({super.key});

  @override
  ConsumerState<EditProductPage> createState() => _EditProductPageState();
}

class _EditProductPageState extends ConsumerState<EditProductPage> {
  late final String productId;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    final args = GoRouterState.of(context).extra as String?;
    productId = args ?? '';
    _loadProduct();
  }

  void _loadProduct() {
    ref
        .read(productNotifierProvider.notifier)
        .fetchProductById(productId)
        .then((_) {
          if (mounted) {
            setState(() {
              _isLoading = false;
            });
          }
        })
        .catchError((_) {
          if (mounted) {
            setState(() {
              _isLoading = false;
            });
          }
        });
  }

  @override
  Widget build(BuildContext context) {
    final productState = ref.watch(productNotifierProvider);
    final product = productState.selectedProduct;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Product'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : product == null
          ? const Center(child: Text('Product not found'))
          : ProductForm(initialProduct: product),
    );
  }
}

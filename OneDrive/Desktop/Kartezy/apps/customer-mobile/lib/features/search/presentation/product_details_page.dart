import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/presentation/widgets/product_image_carousel.dart';
import 'package:customer_mobile/features/search/presentation/widgets/product_details_info.dart';
import 'package:customer_mobile/features/search/presentation/widgets/product_price_section.dart';
import 'package:customer_mobile/features/search/presentation/widgets/product_variant_selector.dart';
import 'package:customer_mobile/features/search/presentation/widgets/product_action_buttons.dart';
import 'package:customer_mobile/features/search/presentation/widgets/product_description_tab.dart';
import 'package:customer_mobile/features/search/presentation/widgets/product_reviews_tab.dart';
import 'package:customer_mobile/features/search/presentation/widgets/product_related_items.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';

class ProductDetailsPage extends ConsumerStatefulWidget {
  final String productId;

  const ProductDetailsPage({super.key, required this.productId});

  @override
  ConsumerState<ProductDetailsPage> createState() => _ProductDetailsPageState();
}

class _ProductDetailsPageState extends ConsumerState<ProductDetailsPage>
    with SingleTickerProviderStateMixin {
  late final Product _product;
  bool _isLoading = true;
  String _error = '';
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadProductDetails();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadProductDetails() async {
    try {
      final product = await ref.read(getProductDetailsUseCaseProvider)(
        widget.productId,
      );
      if (mounted) {
        setState(() {
          _product = product;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_error.isNotEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Product Details')),
        body: Center(child: Text('Error loading product: $_error')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(_product.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {},
          ),
          IconButton(
            icon: Icon(
              _product.isFavorite ? Icons.favorite : Icons.favorite_border,
              color: _product.isFavorite ? Colors.red : null,
            ),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ProductImageCarousel(
              images: [_product.imageUrl],
              productName: _product.name,
            ),
            ProductDetailsInfo(product: _product),
            ProductPriceSection(product: _product),
            ProductVariantSelector(
              variantGroups: const [],
              selectedVariants: const {},
              onVariantChanged: (_) {},
            ),
            ProductActionButtons(product: _product),
            const Divider(height: 32),
            TabBar(
              controller: _tabController,
              labelColor: Colors.black,
              unselectedLabelColor: Colors.grey,
              indicatorColor: Colors.black,
              tabs: const [
                Tab(text: 'Description'),
                Tab(text: 'Reviews'),
                Tab(text: 'Related'),
              ],
            ),
            SizedBox(
              height: 400,
              child: TabBarView(
                controller: _tabController,
                children: [
                  const ProductDescriptionTab(),
                  ProductReviewsTab(
                    productId: widget.productId,
                  ),
                  ProductRelatedItems(
                    productId: widget.productId,
                    categoryId: '',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

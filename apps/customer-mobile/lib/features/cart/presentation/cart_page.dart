import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/cart/provider/provider.dart';
import 'package:customer_mobile/shared/models/cart.dart';
import 'package:customer_mobile/shared/models/cart_item.dart';
import 'package:customer_mobile/core/utils/formatters.dart';

class CartPage extends ConsumerStatefulWidget {
  const CartPage({super.key});

  @override
  ConsumerState<CartPage> createState() => _CartPageState();
}

class _CartPageState extends ConsumerState<CartPage> {
  @override
  void initState() {
    super.initState();
    // Fetch cart on page load (null for guest, or pass userId for logged-in users)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(cartProvider.notifier).fetchCart(null);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cartState = ref.watch(cartProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'My Cart${cartState.cart != null && cartState.cart!.itemCount > 0 ? ' (${cartState.cart!.itemCount})' : ''}',
        ),
        actions: [
          if (cartState.cart != null && cartState.cart!.items.isNotEmpty)
            TextButton(
              onPressed: () => _showClearCartDialog(context),
              child: Text(
                'Clear',
                style: TextStyle(color: theme.colorScheme.error),
              ),
            ),
        ],
      ),
      body: _buildBody(context, theme, cartState),
      bottomNavigationBar:
          cartState.cart != null && cartState.cart!.items.isNotEmpty
              ? _buildBottomBar(context, theme, cartState)
              : null,
    );
  }

  Widget _buildBody(BuildContext context, ThemeData theme, CartState cartState) {
    // Loading state
    if (cartState.isLoading && cartState.cart == null) {
      return const Center(child: CircularProgressIndicator());
    }

    // Error state
    if (cartState.errorMessage != null && cartState.cart == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.error_outline, size: 48, color: Colors.red[300]),
              ),
              const SizedBox(height: 24),
              Text(
                'Could not load cart',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                cartState.errorMessage!,
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600], fontSize: 14),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => ref.read(cartProvider.notifier).fetchCart(null),
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Empty cart state
    if (cartState.cart == null || cartState.cart!.items.isEmpty) {
      return _buildEmptyCart(context, theme);
    }

    // Cart with items
    final cart = cartState.cart!;
    return RefreshIndicator(
      onRefresh: () => ref.read(cartProvider.notifier).fetchCart(null),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Store info header
          _buildStoreHeader(theme),

          const SizedBox(height: 12),

          // Cart items
          ...cart.items.asMap().entries.map((entry) {
            return _buildCartItemCard(context, theme, entry.value, entry.key, cartState);
          }),

          const SizedBox(height: 20),

          // Coupon section
          _buildCouponSection(context, theme, cart),

          const SizedBox(height: 20),

          // Price breakdown
          _buildPriceBreakdown(theme, cart),

          const SizedBox(height: 16),

          // Error message banner
          if (cartState.errorMessage != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.error_outline, color: Colors.red[700], size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        cartState.errorMessage!,
                        style: TextStyle(color: Colors.red[700], fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
            ),

          const SizedBox(height: 80),
        ],
      ),
    );
  }

  Widget _buildEmptyCart(BuildContext context, ThemeData theme) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: theme.primaryColor.withValues(alpha: 0.08),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.shopping_cart_outlined,
                size: 56,
                color: theme.primaryColor,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Your cart is empty',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Add products from nearby stores\nto get started',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[600], fontSize: 14, height: 1.5),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: () => context.go('/home'),
              icon: const Icon(Icons.explore_outlined),
              label: const Text('Explore Stores'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () => ref.read(cartProvider.notifier).fetchCart(null),
              child: Text(
                'Refresh',
                style: TextStyle(color: Colors.grey[500]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStoreHeader(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.primaryColor.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.primaryColor.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: theme.primaryColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(Icons.store_outlined, color: theme.primaryColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Delivery from local stores',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                    color: theme.primaryColor,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '30-40 min delivery',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.flash_on, size: 14, color: Colors.green[700]),
                const SizedBox(width: 2),
                Text(
                  'INSTANT',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.green[700],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCartItemCard(
    BuildContext context,
    ThemeData theme,
    CartItem item,
    int index,
    CartState cartState,
  ) {
    final lineTotal = item.product.price * item.quantity;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product image
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: SizedBox(
                width: 80,
                height: 80,
                child: Image.network(
                  item.product.imageUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    color: Colors.grey[100],
                    child: Icon(Icons.image_outlined, color: Colors.grey[400], size: 32),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Product details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product name
                  Text(
                    item.product.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),

                  // Variant info
                  if (item.selectedVariants.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Text(
                        item.selectedVariants.values.join(', '),
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ),

                  // Unit price
                  Text(
                    formatCurrency(item.product.price),
                    style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                  ),

                  const Spacer(),

                  // Quantity controls and line total
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Quantity controls
                      Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Decrement
                            InkWell(
                              onTap: () {
                                if (item.quantity <= 1) {
                                  _showRemoveItemDialog(context, item);
                                } else {
                                  ref
                                      .read(cartProvider.notifier)
                                      .updateCartItemQuantity(item.id, item.quantity - 1);
                                }
                              },
                              borderRadius: BorderRadius.circular(8),
                              child: Container(
                                padding: const EdgeInsets.all(6),
                                child: Icon(
                                  item.quantity <= 1 ? Icons.delete_outline : Icons.remove,
                                  size: 18,
                                  color: item.quantity <= 1
                                      ? Colors.red[400]
                                      : Colors.grey[700],
                                ),
                              ),
                            ),

                            // Quantity
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              child: cartState.isLoading
                                  ? SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: theme.primaryColor,
                                      ),
                                    )
                                  : Text(
                                      '${item.quantity}',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 14,
                                      ),
                                    ),
                            ),

                            // Increment
                            InkWell(
                              onTap: () {
                                ref
                                    .read(cartProvider.notifier)
                                    .updateCartItemQuantity(item.id, item.quantity + 1);
                              },
                              borderRadius: BorderRadius.circular(8),
                              child: Container(
                                padding: const EdgeInsets.all(6),
                                child: Icon(
                                  Icons.add,
                                  size: 18,
                                  color: theme.primaryColor,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Line total
                      Text(
                        formatCurrency(lineTotal),
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCouponSection(BuildContext context, ThemeData theme, Cart cart) {
    final hasCoupon = cart.couponCode != null && cart.couponCode!.isNotEmpty;

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.local_offer_outlined, color: theme.primaryColor, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Coupon',
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (hasCoupon)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.check_circle, color: Colors.green[600], size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Coupon "${cart.couponCode}" applied',
                        style: TextStyle(
                          color: Colors.green[700],
                          fontWeight: FontWeight.w500,
                          fontSize: 13,
                        ),
                      ),
                    ),
                    Text(
                      '-${formatCurrency(cart.discountAmount)}',
                      style: TextStyle(
                        color: Colors.green[700],
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: () => ref.read(cartProvider.notifier).removeCoupon(),
                      child: Icon(Icons.close, size: 18, color: Colors.green[700]),
                    ),
                  ],
                ),
              )
            else
              InkWell(
                onTap: () => _showCouponPicker(context),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: Row(
                    children: [
                      Text(
                        'Apply a coupon code',
                        style: TextStyle(color: Colors.grey[500], fontSize: 14),
                      ),
                      const Spacer(),
                      Icon(Icons.chevron_right, color: Colors.grey[400], size: 20),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceBreakdown(ThemeData theme, Cart cart) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.receipt_long_outlined, color: theme.primaryColor, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Price Breakdown',
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildPriceRow('Subtotal (${cart.itemCount} items)', formatCurrency(cart.totalAmount)),
            const SizedBox(height: 8),
            _buildPriceRow('Delivery Fee', formatCurrency(cart.deliveryCharges)),
            const SizedBox(height: 8),
            if (cart.discountAmount > 0) ...[
              _buildPriceRow(
                'Discount',
                '-${formatCurrency(cart.discountAmount)}',
                color: Colors.green,
              ),
              const SizedBox(height: 8),
            ],
            if (cart.platformFee > 0) ...[
              _buildPriceRow('Platform Fee', formatCurrency(cart.platformFee)),
              const SizedBox(height: 8),
            ],
            if (cart.packagingFee > 0) ...[
              _buildPriceRow('Packaging Fee', formatCurrency(cart.packagingFee)),
              const SizedBox(height: 8),
            ],
            _buildPriceRow('Tax (GST)', formatCurrency(cart.gstAmount)),
            const SizedBox(height: 8),
            if (cart.tipAmount > 0) ...[
              _buildPriceRow('Tip', formatCurrency(cart.tipAmount)),
              const SizedBox(height: 8),
            ],
            if (cart.walletAmount > 0) ...[
              _buildPriceRow(
                'Wallet',
                '-${formatCurrency(cart.walletAmount)}',
                color: Colors.blue,
              ),
              const SizedBox(height: 8),
            ],
            const Divider(height: 1),
            const SizedBox(height: 8),
            _buildPriceRow(
              'Total',
              formatCurrency(cart.netAmount),
              isBold: true,
              fontSize: 16,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceRow(
    String label,
    String value, {
    Color? color,
    bool isBold = false,
    double fontSize = 14,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: color ?? Colors.grey[700],
            fontSize: fontSize - 2,
            fontWeight: isBold ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: color ?? Colors.black87,
            fontSize: fontSize,
            fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildBottomBar(BuildContext context, ThemeData theme, CartState cartState) {
    final cart = cartState.cart!;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            // Total
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Total Amount',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                  Text(
                    formatCurrency(cart.netAmount),
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: theme.primaryColor,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 12),

            // Proceed to Checkout
            SizedBox(
              height: 48,
              child: ElevatedButton.icon(
                onPressed: cartState.isLoading
                    ? null
                    : () => context.push('/checkout'),
                icon: cartState.isLoading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.shopping_bag_outlined),
                label: Text(cartState.isLoading ? 'Loading...' : 'Proceed'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.primaryColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showClearCartDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Clear Cart'),
        content: const Text('Are you sure you want to remove all items from your cart?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(cartProvider.notifier).clearCart();
              Navigator.pop(ctx);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }

  void _showRemoveItemDialog(BuildContext context, CartItem item) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Remove Item'),
        content: Text('Remove "${item.product.name}" from cart?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(cartProvider.notifier).removeCartItem(item.id);
              Navigator.pop(ctx);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Remove'),
          ),
        ],
      ),
    );
  }

  void _showCouponPicker(BuildContext context) {
    final controller = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 16,
            right: 16,
            top: 16,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
          ),
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
              const SizedBox(height: 16),
              Text(
                'Apply Coupon',
                style: Theme.of(ctx).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: controller,
                      autofocus: true,
                      decoration: InputDecoration(
                        hintText: 'Enter coupon code',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 14,
                        ),
                      ),
                      textCapitalization: TextCapitalization.characters,
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: () {
                      if (controller.text.trim().isNotEmpty) {
                        ref
                            .read(cartProvider.notifier)
                            .applyCoupon(controller.text.trim());
                        Navigator.pop(ctx);
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 14,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Apply'),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                'Try: WELCOME100',
                style: TextStyle(color: Colors.grey[500], fontSize: 12),
              ),
            ],
          ),
        );
      },
    );
  }
}

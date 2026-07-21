import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/checkout/provider/provider.dart';
import 'package:customer_mobile/shared/models/checkout_summary.dart';
import 'package:customer_mobile/core/utils/formatters.dart';

class CheckoutPage extends ConsumerWidget {
  const CheckoutPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final checkoutState = ref.watch(checkoutProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
        actions: [
          if (checkoutState.isLoading)
            const Padding(
              padding: EdgeInsets.all(16),
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ),
        ],
      ),
      body: _buildBody(context, ref, theme, checkoutState),
      bottomNavigationBar: checkoutState.cartSummary != null
          ? _buildBottomBar(context, ref, theme, checkoutState)
          : null,
    );
  }

  Widget _buildBody(
    BuildContext context,
    WidgetRef ref,
    ThemeData theme,
    CheckoutState state,
  ) {
    if (state.isLoading && state.cartSummary == null) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.errorMessage != null && state.cartSummary == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 64, color: Colors.grey[300]),
              const SizedBox(height: 16),
              Text(
                'Could not load checkout',
                style: theme.textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                state.errorMessage!,
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600]),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => ref.read(checkoutProvider.notifier).loadCartSummary(),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    if (state.cartSummary == null) {
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
                  color: theme.primaryColor.withValues(alpha: 0.08),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.receipt_long_outlined,
                  size: 48,
                  color: theme.primaryColor,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'No items to checkout',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Add products to your cart first',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600], fontSize: 14),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go('/cart'),
                child: const Text('Go to Cart'),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () => ref.read(checkoutProvider.notifier).loadCartSummary(),
                child: const Text('Refresh'),
              ),
            ],
          ),
        ),
      );
    }

    final cartSummary = state.cartSummary!;

    return RefreshIndicator(
      onRefresh: () => ref.read(checkoutProvider.notifier).loadCartSummary(),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Delivery Address Section
          _buildSectionHeader(theme, 'Delivery Address', Icons.location_on_outlined),
          const SizedBox(height: 8),
          _buildAddressCard(context, ref, theme, state),

          const SizedBox(height: 20),

          // Delivery Options
          _buildSectionHeader(theme, 'Delivery Options', Icons.delivery_dining_outlined),
          const SizedBox(height: 8),
          _buildDeliveryOptionsCard(context, ref, theme, state),

          const SizedBox(height: 20),

          // Order Items Summary
          _buildSectionHeader(theme, 'Order Summary', Icons.receipt_outlined),
          const SizedBox(height: 8),
          _buildOrderSummaryCard(context, theme, cartSummary),

          const SizedBox(height: 20),

          // Coupon Section
          _buildSectionHeader(theme, 'Coupon', Icons.discount_outlined),
          const SizedBox(height: 8),
          _buildCouponCard(context, ref, theme, state),

          const SizedBox(height: 20),

          // Price Details
          _buildSectionHeader(theme, 'Price Details', Icons.currency_rupee),
          const SizedBox(height: 8),
          _buildPriceDetailsCard(context, theme, cartSummary),

          const SizedBox(height: 24),

          // Error message if any
          if (state.errorMessage != null)
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
                        state.errorMessage!,
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

  Widget _buildSectionHeader(ThemeData theme, String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 20, color: theme.primaryColor),
        const SizedBox(width: 8),
        Text(
          title,
          style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildAddressCard(
    BuildContext context,
    WidgetRef ref,
    ThemeData theme,
    CheckoutState state,
  ) {
    final address = state.selectedAddress;
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => _showAddressPicker(context, ref),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: theme.primaryColor.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(Icons.home_outlined, color: theme.primaryColor, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: address != null
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            address.addressLine1,
                            style: const TextStyle(fontWeight: FontWeight.w500),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          if (address.isDefault) ...[
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: theme.primaryColor.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                'Default',
                                style: TextStyle(fontSize: 10, color: theme.primaryColor),
                              ),
                            ),
                          ],
                        ],
                      )
                    : Text(
                        'Add delivery address',
                        style: TextStyle(color: Colors.grey[500]),
                      ),
              ),
              const Icon(Icons.chevron_right, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDeliveryOptionsCard(
    BuildContext context,
    WidgetRef ref,
    ThemeData theme,
    CheckoutState state,
  ) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Instant Delivery', style: TextStyle(fontSize: 14)),
              subtitle: const Text('Deliver within 30 minutes', style: TextStyle(fontSize: 12)),
              value: state.instantDelivery,
              onChanged: (val) {
                ref.read(checkoutProvider.notifier).setInstantDelivery(val);
              },
            ),
            const Divider(height: 1),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Contactless Delivery', style: TextStyle(fontSize: 14)),
              subtitle: const Text('Leave at my door', style: TextStyle(fontSize: 12)),
              value: state.contactlessDelivery,
              onChanged: (val) {
                ref.read(checkoutProvider.notifier).setContactlessDelivery(val);
              },
            ),
            const Divider(height: 1),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Delivery Instructions',
                hintText: 'e.g., Gate code, landmark',
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 12),
              ),
              maxLines: 2,
              onChanged: (val) {
                ref.read(checkoutProvider.notifier).setDeliveryInstructions(val);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderSummaryCard(
    BuildContext context,
    ThemeData theme,
    CheckoutSummary cartSummary,
  ) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ...cartSummary.items.take(3).map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            item.product.imageUrl,
                            width: 48,
                            height: 48,
                            fit: BoxFit.cover,                              errorBuilder: (context, error, stackTrace) => Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: Colors.grey[100],
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(Icons.image, color: Colors.grey[400]),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.product.name,
                                style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              if (item.selectedVariants.isNotEmpty)
                                Text(
                                  item.selectedVariants.values.join(', '),
                                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                                ),
                            ],
                          ),
                        ),
                        Text(
                          'x${item.quantity}',
                          style: TextStyle(color: Colors.grey[600], fontSize: 13),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          formatCurrency(item.product.price * item.quantity),
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                        ),
                      ],
                    ),
                  )),
            if (cartSummary.items.length > 3)
              TextButton(
                onPressed: null,
                child: Text('+${cartSummary.items.length - 3} more items'),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildCouponCard(
    BuildContext context,
    WidgetRef ref,
    ThemeData theme,
    CheckoutState state,
  ) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(Icons.local_offer_outlined, color: theme.primaryColor, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Apply Coupon',
                style: TextStyle(color: Colors.grey[600]),
              ),
            ),
            TextButton(
              onPressed: () => _showCouponPicker(context, ref),
              child: const Text('Apply'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceDetailsCard(
    BuildContext context,
    ThemeData theme,
    CheckoutSummary cartSummary,
  ) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildPriceRow('Subtotal', formatCurrency(cartSummary.netAmount + cartSummary.discountAmount - cartSummary.deliveryCharges - cartSummary.gstAmount - cartSummary.platformFee - cartSummary.packagingFee)),
            const SizedBox(height: 8),
            _buildPriceRow('Delivery Fee', formatCurrency(cartSummary.deliveryCharges)),
            const SizedBox(height: 8),
            if (cartSummary.discountAmount > 0) ...[
              _buildPriceRow(
                'Discount',
                formatCurrency(cartSummary.discountAmount),
                color: Colors.green,
              ),
              const SizedBox(height: 8),
            ],
            _buildPriceRow('Platform Fee', formatCurrency(cartSummary.platformFee)),
            const SizedBox(height: 8),
            _buildPriceRow('Tax (GST)', formatCurrency(cartSummary.gstAmount)),
            const SizedBox(height: 8),
            _buildPriceRow('Packaging Fee', formatCurrency(cartSummary.packagingFee)),
            const SizedBox(height: 8),
            const Divider(height: 1),
            const SizedBox(height: 8),
            _buildPriceRow(
              'Total',
              formatCurrency(cartSummary.netAmount),
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

  Widget _buildBottomBar(
    BuildContext context,
    WidgetRef ref,
    ThemeData theme,
    CheckoutState state,
  ) {
    final cartSummary = state.cartSummary!;
    final notifier = ref.read(checkoutProvider.notifier);

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
                    formatCurrency(cartSummary.netAmount),
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: theme.primaryColor,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 48,
              child: ElevatedButton.icon(
                onPressed: state.isLoading || state.selectedAddress == null
                    ? null
                    : () async {
                        await notifier.placeOrder();
                        if (context.mounted) {
                          context.go('/orders');
                        }
                      },
                icon: state.isLoading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.shopping_bag_outlined),
                label: Text(state.isLoading ? 'Placing Order...' : 'Place Order'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddressPicker(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(16),
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
              'Select Delivery Address',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.add_circle_outline),
              title: const Text('Add New Address'),
              onTap: () {
                Navigator.pop(ctx);
                context.push('/profile');
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showCouponPicker(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        final controller = TextEditingController();
        return Container(
          padding: const EdgeInsets.all(16),
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
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: controller,
                      decoration: const InputDecoration(
                        hintText: 'Enter coupon code',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: () {
                      if (controller.text.isNotEmpty) {
                        ref.read(checkoutProvider.notifier).applyCoupon(controller.text);
                        Navigator.pop(ctx);
                      }
                    },
                    child: const Text('Apply'),
                  ),
                ],
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }
}

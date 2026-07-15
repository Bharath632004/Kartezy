import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/services/promotion_service.dart';
import 'package:merchant_mobile/features/promotions/presentation/providers/promotion_provider.dart';

class PromotionsPage extends ConsumerStatefulWidget {
  const PromotionsPage({super.key});

  @override
  ConsumerState<PromotionsPage> createState() => _PromotionsPageState();
}

class _PromotionsPageState extends ConsumerState<PromotionsPage> {
  final ScrollController _scrollController = ScrollController();
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _loadInitialData();
    _scrollController.addListener(_scrollListener);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_scrollListener);
    _scrollController.dispose();
    super.dispose();
  }

  void _loadInitialData() {
    ref.read(promotionProvider.notifier).fetchPromotions(refresh: true);
  }

  void _scrollListener() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      if (!ref.read(promotionProvider).isLoading &&
          ref.read(promotionProvider).hasMore &&
          !_isLoadingMore) {
        _loadMore();
      }
    }
  }

  void _loadMore() {
    setState(() => _isLoadingMore = true);
    ref.read(promotionProvider.notifier).fetchPromotions(refresh: false).then((
      _,
    ) {
      setState(() => _isLoadingMore = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final promotionState = ref.watch(promotionProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Promotions'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddPromotionDialog(context),
          ),
        ],
      ),
      body: promotionState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : promotionState.error != null
          ? Center(child: Text('Error: ${promotionState.error}'))
          : promotionState.promotions.isEmpty
          ? const Center(child: Text('No promotions found'))
          : RefreshIndicator(
              onRefresh: () => ref
                  .read(promotionProvider.notifier)
                  .fetchPromotions(refresh: true),
              child: ListView.builder(
                controller: _scrollController,
                itemCount:
                    promotionState.promotions.length + (_isLoadingMore ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index < promotionState.promotions.length) {
                    final promotion = promotionState.promotions[index];
                    return ListTile(
                      title: Text(promotion['name'] ?? 'Unnamed Promotion'),
                      subtitle: Text(promotion['type'] ?? 'Unknown Type'),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit),
                            onPressed: () =>
                                _editPromotion(context, promotion['id']?.toString() ?? ''),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete),
                            onPressed: () => _deletePromotion(promotion['id']?.toString() ?? ''),
                          ),
                        ],
                      ),
                    );
                  } else {
                    return const Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Center(child: CircularProgressIndicator()),
                    );
                  }
                },
              ),
            ),
    );
  }

  void _showAddPromotionDialog(BuildContext context) {
    final TextEditingController nameController = TextEditingController();
    final TextEditingController typeController = TextEditingController();
    final TextEditingController discountController = TextEditingController();
    final TextEditingController startDateController = TextEditingController();
    final TextEditingController endDateController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Promotion'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'Name'),
              ),
              TextField(
                controller: typeController,
                decoration: const InputDecoration(
                  labelText: 'Type (e.g., coupon, discount)',
                ),
              ),
              TextField(
                controller: discountController,
                decoration: const InputDecoration(labelText: 'Discount Value'),
                keyboardType: TextInputType.number,
              ),
              TextField(
                controller: startDateController,
                decoration: const InputDecoration(
                  labelText: 'Start Date (YYYY-MM-DD)',
                ),
              ),
              TextField(
                controller: endDateController,
                decoration: const InputDecoration(
                  labelText: 'End Date (YYYY-MM-DD)',
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final promotionData = {
                'name': nameController.text,
                'type': typeController.text,
                'discount_value':
                    double.tryParse(discountController.text) ?? 0.0,
                'start_date': startDateController.text,
                'end_date': endDateController.text,
                'is_active': true,
              };
              try {
                await ref
                    .read(promotionProvider.notifier)
                    .createPromotion(promotionData);
                if (!mounted) return;
                Navigator.pop(context);
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Promotion created successfully'),
                  ),
                );
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to create promotion: $e')),
                  );
                }
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _editPromotion(BuildContext context, String id) async {
    try {
      final promotionService = ref.read(promotionServiceProvider);
      final promotion = await promotionService.getPromotionById(id);
      if (!mounted) return;

      final TextEditingController nameController = TextEditingController(
        text: promotion['name'],
      );
      final TextEditingController typeController = TextEditingController(
        text: promotion['type'],
      );
      final TextEditingController discountController = TextEditingController(
        text: promotion['discount_value'].toString(),
      );
      final TextEditingController startDateController = TextEditingController(
        text: promotion['start_date'],
      );
      final TextEditingController endDateController = TextEditingController(
        text: promotion['end_date'],
      );

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Edit Promotion'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Name'),
                ),
                TextField(
                  controller: typeController,
                  decoration: const InputDecoration(labelText: 'Type'),
                ),
                TextField(
                  controller: discountController,
                  decoration: const InputDecoration(
                    labelText: 'Discount Value',
                  ),
                  keyboardType: TextInputType.number,
                ),
                TextField(
                  controller: startDateController,
                  decoration: const InputDecoration(
                    labelText: 'Start Date (YYYY-MM-DD)',
                  ),
                ),
                TextField(
                  controller: endDateController,
                  decoration: const InputDecoration(
                    labelText: 'End Date (YYYY-MM-DD)',
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                final promotionData = {
                  'name': nameController.text,
                  'type': typeController.text,
                  'discount_value':
                      double.tryParse(discountController.text) ?? 0.0,
                  'start_date': startDateController.text,
                  'end_date': endDateController.text,
                  'is_active': promotion['is_active'],
                };
                try {
                  await ref
                      .read(promotionProvider.notifier)
                      .updatePromotion(id, promotionData);
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Promotion updated successfully'),
                    ),
                  );
                } catch (e) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Failed to update promotion: $e')),
                    );
                  }
                }
              },
              child: const Text('Update'),
            ),
          ],
        ),
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading promotion: $e')));
      }
    }
  }

  void _deletePromotion(String id) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Promotion'),
        content: const Text('Are you sure you want to delete this promotion?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              try {
                await ref.read(promotionProvider.notifier).deletePromotion(id);
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Promotion deleted successfully'),
                  ),
                );
              } catch (e) {
                if (mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to delete promotion: $e')),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}

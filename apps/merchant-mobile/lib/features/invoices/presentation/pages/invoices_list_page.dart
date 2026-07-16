import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/features/invoices/presentation/providers/invoices_provider.dart';

class InvoicesListPage extends ConsumerStatefulWidget {
  const InvoicesListPage({super.key});

  @override
  ConsumerState<InvoicesListPage> createState() => _InvoicesListPageState();
}

class _InvoicesListPageState extends ConsumerState<InvoicesListPage> {
  late final ScrollController _scrollController;
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_scrollListener);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_scrollListener);
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollListener() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      if (!ref.read(invoicesProvider).isLoading &&
          ref.read(invoicesProvider).hasMore &&
          !_isLoadingMore) {
        _loadMore();
      }
    }
  }

  void _loadMore() {
    setState(() => _isLoadingMore = true);
    ref.read(invoicesProvider.notifier).loadMoreInvoices().then((_) {
      setState(() => _isLoadingMore = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final invoicesState = ref.watch(invoicesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Invoices'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showCreateInvoiceDialog(context),
          ),
          IconButton(
            icon: const Icon(Icons.file_download),
            onPressed: () => _exportInvoices(),
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () =>
                ref.read(invoicesProvider.notifier).refreshInvoices(),
          ),
        ],
      ),
      body: invoicesState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : invoicesState.invoices.isEmpty
          ? const Center(child: Text('No invoices found'))
          : RefreshIndicator(
              onRefresh: () =>
                  ref.read(invoicesProvider.notifier).refreshInvoices(),
              child: ListView.builder(
                controller: _scrollController,
                itemCount:
                    invoicesState.invoices.length + (_isLoadingMore ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index < invoicesState.invoices.length) {
                    final invoice = invoicesState.invoices[index];
                    return ListTile(
                      title: Text(
                        'Invoice #${invoice['invoice_number'] ?? 'N/A'}',
                      ),
                      subtitle: Text(
                        'Date: ${invoice['date'] ?? 'N/A'} | Amount: \$${invoice['total_amount'] ?? 0}',
                      ),
                      trailing: PopupMenuButton<String>(
                        onSelected: (value) =>
                            _handlePopupMenuSelection(value, invoice['id']),
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: 'view',
                            child: ListTile(
                              leading: Icon(Icons.visibility),
                              title: Text('View Details'),
                            ),
                          ),
                          const PopupMenuItem(
                            value: 'download_pdf',
                            child: ListTile(
                              leading: Icon(Icons.picture_as_pdf),
                              title: Text('Download PDF'),
                            ),
                          ),
                          const PopupMenuItem(
                            value: 'print',
                            child: ListTile(
                              leading: Icon(Icons.print),
                              title: Text('Print'),
                            ),
                          ),
                        ],
                      ),
                      onTap: () => _showInvoiceDetails(invoice['id']),
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

  void _handlePopupMenuSelection(String value, dynamic invoiceId) {
    final id = invoiceId?.toString() ?? '';
    switch (value) {
      case 'view':
        _showInvoiceDetails(id);
        break;
      case 'download_pdf':
        _downloadInvoicePdf(id);
        break;
      case 'print':
        _printInvoice(id);
        break;
    }
  }

  void _showInvoiceDetails(String invoiceId) {
    // Use FutureBuilder inside the dialog to avoid async gaps with BuildContext
    showDialog(
      context: context,
      builder: (ctx) => FutureBuilder<Map<String, dynamic>>(
        future: ref.read(invoicesProvider.notifier).getInvoiceDetails(invoiceId),
        builder: (ctx, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const AlertDialog(
              content: SizedBox(
                height: 100,
                child: Center(child: CircularProgressIndicator()),
              ),
            );
          }
          if (snapshot.hasError) {
            return AlertDialog(
              title: const Text('Error'),
              content: Text('${snapshot.error}'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Close'),
                ),
              ],
            );
          }
          return AlertDialog(
            title: const Text('Invoice Details'),
            content: SingleChildScrollView(
              child: Text('${snapshot.data}'),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Close'),
              ),
            ],
          );
        },
      ),
    );
  }

  void _downloadInvoicePdf(String invoiceId) async {
    final messenger = context.mounted ? ScaffoldMessenger.of(context) : null;
    try {
      await ref.read(invoicesProvider.notifier).downloadInvoicePdf(invoiceId);
      messenger?.showSnackBar(
        const SnackBar(content: Text('PDF downloaded successfully')),
      );
    } catch (e) {
      messenger?.showSnackBar(
        SnackBar(content: Text('Error downloading PDF: $e')),
      );
    }
  }

  void _printInvoice(String invoiceId) async {
    final messenger = context.mounted ? ScaffoldMessenger.of(context) : null;
    try {
      await ref.read(invoicesProvider.notifier).printInvoice(invoiceId);
      messenger?.showSnackBar(
        const SnackBar(content: Text('Print command sent')),
      );
    } catch (e) {
      messenger?.showSnackBar(
        SnackBar(content: Text('Error printing: $e')),
      );
    }
  }

  void _showCreateInvoiceDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Create Invoice'),
        content: const SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: InputDecoration(labelText: 'Customer Name'),
              ),
              SizedBox(height: 12),
              TextField(decoration: InputDecoration(labelText: 'Order Number')),
              SizedBox(height: 12),
              TextField(
                decoration: InputDecoration(labelText: 'Amount'),
                keyboardType: TextInputType.number,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: null, child: Text('Cancel')),
          ElevatedButton(onPressed: null, child: Text('Create')),
        ],
      ),
    );
  }

  Future<void> _exportInvoices() async {
    // Capture messenger before any async gap
    final messenger = context.mounted ? ScaffoldMessenger.of(context) : null;
    // Show dialog to let user choose format - no async work inside dialog
    final format = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Export Invoices'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Select export format:'),
            const SizedBox(height: 16),
            Wrap(
              spacing: 12,
              children: [
                ElevatedButton(
                  onPressed: () => Navigator.pop(ctx, 'csv'),
                  child: const Text('CSV'),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.pop(ctx, 'pdf'),
                  child: const Text('PDF'),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );

    // Do the async work outside the dialog builder closures
    if (format == null || messenger == null) return;
    try {
      await ref.read(invoicesProvider.notifier).exportInvoices(format: format);
      messenger.showSnackBar(
        SnackBar(
          content: Text('${format.toUpperCase()} exported successfully'),
        ),
      );
    } catch (e) {
      messenger.showSnackBar(
        SnackBar(content: Text('Error exporting $format: $e')),
      );
    }
  }
}

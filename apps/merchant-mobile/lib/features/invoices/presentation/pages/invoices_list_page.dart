import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/features/invoices/presentation/providers/invoices_provider.dart';

class InvoicesPage extends ConsumerStatefulWidget {
  const InvoicesPage({Key? key}) : super(key: key);

  @override
  ConsumerState<InvoicesPage> createState() => _InvoicesPageState();
}

class _InvoicesPageState extends ConsumerState<InvoicesPage> {
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
            onPressed: () => _exportInvoices(context),
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(invoicesProvider.notifier).refreshInvoices(),
          ),
        ],
      ),
      body: invoicesState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : invoicesState.invoices.isEmpty
              ? const Center(child: Text('No invoices found'))
              : RefreshIndicator(
                  onRefresh: () => ref.read(invoicesProvider.notifier).refreshInvoices(),
                  child: ListView.builder(
                    controller: _scrollController,
                    itemCount: invoicesState.invoices.length +
                        (_isLoadingMore ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index < invoicesState.invoices.length) {
                        final invoice = invoicesState.invoices[index];
                        return ListTile(
                          title: Text('Invoice #${invoice['invoice_number'] ?? 'N/A'}'),
                          subtitle: Text(
                            'Date: ${invoice['date'] ?? 'N/A'} | Amount: \$${invoice['total_amount'] ?? 0}',
                          ),
                          trailing: PopupMenuButton<String>(
                            onSelected: (value) => _handlePopupMenuSelection(value, invoice['id']),
                            itemBuilder: (context) => [
                              const PopupMenuItem(
                                value: 'view',
                                child: ListTile(
                                  leading: Icon(Icons.visibility),
                                  text: 'View Details',
                                ),
                              ),
                              const PopupMenuItem(
                                value: 'download_pdf',
                                child: ListTile(
                                  leading: Icon(Icons.picture_as_pdf),
                                  text: 'Download PDF',
                                ),
                              ),
                              const PopupMenuItem(
                                value: 'print',
                                child: ListTile(
                                  leading: Icon(Icons.print),
                                  text: 'Print',
                                ),
                              ),
                            ],
                          ),
                          onTap: () => _showInvoiceDetails(context, invoice['id']),
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

  void _handlePopupMenuSelection(String value, String invoiceId) async {
    switch (value) {
      case 'view':
        _showInvoiceDetails(context, invoiceId);
        break;
      case 'download_pdf':
        _downloadInvoicePdf(invoiceId);
        break;
      case 'print':
        _printInvoice(invoiceId);
        break;
    }
  }

  void _showInvoiceDetails(BuildContext context, String invoiceId) async {
    try {
      final invoiceDetails = await ref.read(invoicesProvider.notifier).getInvoiceDetails(invoiceId);
      if (!mounted) return;

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Invoice Details'),
          content: SingleChildScrollView(
            child: Text(invoiceDetails.toString()),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading invoice details: $e')),
      );
    }
  }

  void _downloadInvoicePdf(String invoiceId) async {
    try {
      final pdfBytes = await ref.read(invoicesProvider.notifier).downloadInvoicePdf(invoiceId);
      // In a real app, you would save or share the PDF file
      // For now, we'll just show a success message
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('PDF downloaded successfully')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error downloading PDF: $e')),
      );
    }
  }

  void _printInvoice(String invoiceId) async {
    try {
      await ref.read(invoicesProvider.notifier).printInvoice(invoiceId);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Print command sent')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error printing: $e')),
      );
    }
  }

  void _showCreateInvoiceDialog(BuildContext context) {
    // Implementation for creating a new invoice
    // This would typically navigate to a create invoice screen
    // For now, we'll just show a placeholder
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Create invoice feature coming soon')),
    );
  }

  void _exportInvoices(BuildContext context) async {
    // Simple export implementation
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
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
                  onPressed: () async {
                    Navigator.pop(context);
                    try {
                      final csvData = await ref.read(invoicesProvider.notifier).exportInvoices(format: 'csv');
                      // In a real app, you would save or share the CSV file
                      if (!mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('CSV exported successfully')),
                      );
                    } catch (e) {
                      if (!mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Error exporting CSV: $e')),
                      );
                    }
                  },
                  child: const Text('CSV'),
                ),
                ElevatedButton(
                  onPressed: () async {
                    Navigator.pop(context);
                    try {
                      final pdfData = await ref.read(invoicesProvider.notifier).exportInvoices(format: 'pdf');
                      // In a real app, you would save or share the PDF file
                      if (!mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('PDF exported successfully')),
                      );
                    } catch (e) {
                      if (!mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Error exporting PDF: $e')),
                      );
                    }
                  },
                  child: const Text('PDF'),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }
}
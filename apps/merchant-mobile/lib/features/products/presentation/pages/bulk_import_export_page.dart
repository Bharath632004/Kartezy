import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Page for bulk importing and exporting products via CSV/Excel.
class BulkImportExportPage extends ConsumerStatefulWidget {
  const BulkImportExportPage({super.key});

  @override
  ConsumerState<BulkImportExportPage> createState() =>
      _BulkImportExportPageState();
}

class _BulkImportExportPageState extends ConsumerState<BulkImportExportPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isImporting = false;
  String? _selectedFileName;
  double _importProgress = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bulk Import/Export'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Import'),
            Tab(text: 'Export'),
          ],
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: Colors.grey,
          indicatorColor: theme.colorScheme.primary,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [_buildImportTab(theme), _buildExportTab(theme)],
      ),
    );
  }

  Widget _buildImportTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Instructions card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.info_outline,
                        color: theme.colorScheme.primary,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Import Instructions',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildInstructionRow('1', 'Download the CSV template below'),
                  _buildInstructionRow('2', 'Fill in product details'),
                  _buildInstructionRow('3', 'Save as CSV file'),
                  _buildInstructionRow('4', 'Upload the file here'),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.download, size: 18),
                    label: const Text('Download Template'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Upload area
          Card(
            child: InkWell(
              onTap: _pickFile,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: Colors.grey.shade300,
                    style: BorderStyle.solid,
                    width: 2,
                  ),
                ),
                child: Column(
                  children: [
                    Icon(
                      _selectedFileName != null
                          ? Icons.description
                          : Icons.upload_file,
                      size: 48,
                      color: _selectedFileName != null
                          ? Colors.green
                          : Colors.grey[400],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _selectedFileName ?? 'Tap to select CSV file',
                      style: TextStyle(
                        color: _selectedFileName != null
                            ? Colors.black87
                            : Colors.grey[600],
                        fontWeight: _selectedFileName != null
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Supports .csv files up to 10MB',
                      style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Progress (when importing)
          if (_isImporting) ...[
            LinearProgressIndicator(value: _importProgress),
            const SizedBox(height: 8),
            Text(
              'Importing... ${(_importProgress * 100).toStringAsFixed(0)}%',
              style: TextStyle(color: Colors.grey[600], fontSize: 13),
            ),
            const SizedBox(height: 16),
          ],

          // Import button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: _selectedFileName != null && !_isImporting
                  ? _startImport
                  : null,
              icon: Icon(
                _isImporting ? Icons.hourglass_top : Icons.file_upload,
              ),
              label: Text(_isImporting ? 'Importing...' : 'Start Import'),
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExportTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Export your product catalog',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Choose what to include in the exported file',
            style: TextStyle(color: Colors.grey[600], fontSize: 13),
          ),
          const SizedBox(height: 16),

          // Export options
          Card(
            child: Column(
              children: [
                SwitchListTile(
                  title: const Text('Product Name & Description'),
                  subtitle: const Text('Basic product information'),
                  value: true,
                  onChanged: (_) {},
                ),
                const Divider(height: 1),
                SwitchListTile(
                  title: const Text('Pricing (MRP, Selling Price)'),
                  value: true,
                  onChanged: (_) {},
                ),
                const Divider(height: 1),
                SwitchListTile(
                  title: const Text('SKU & Barcode'),
                  value: true,
                  onChanged: (_) {},
                ),
                const Divider(height: 1),
                SwitchListTile(
                  title: const Text('Inventory & Stock'),
                  value: true,
                  onChanged: (_) {},
                ),
                const Divider(height: 1),
                SwitchListTile(
                  title: const Text('Variants & Attributes'),
                  value: false,
                  onChanged: (_) {},
                ),
                const Divider(height: 1),
                SwitchListTile(
                  title: const Text('Images (as URLs)'),
                  value: false,
                  onChanged: (_) {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Format selection
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Export Format',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.table_chart, size: 18),
                          label: const Text('CSV'),
                          style: OutlinedButton.styleFrom(
                            backgroundColor: Colors.deepPurple.shade50,
                            side: BorderSide(color: Colors.deepPurple),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {},
                          icon: const Icon(
                            Icons.table_chart_outlined,
                            size: 18,
                          ),
                          label: const Text('Excel'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Date filter
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Date Filter',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          decoration: const InputDecoration(
                            labelText: 'From',
                            border: OutlineInputBorder(),
                            prefixIcon: Icon(Icons.calendar_today, size: 18),
                          ),
                          readOnly: true,
                          onTap: () {},
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextField(
                          decoration: const InputDecoration(
                            labelText: 'To',
                            border: OutlineInputBorder(),
                            prefixIcon: Icon(Icons.calendar_today, size: 18),
                          ),
                          readOnly: true,
                          onTap: () {},
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Export button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(const SnackBar(content: Text('Export started')));
              },
              icon: const Icon(Icons.download),
              label: const Text('Export Products'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInstructionRow(String number, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Colors.deepPurple.shade100,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                number,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.deepPurple,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Text(text, style: const TextStyle(fontSize: 13)),
        ],
      ),
    );
  }

  void _pickFile() {
    // Simulate file picker
    setState(() {
      _selectedFileName = 'products_import_may2026.csv';
    });
  }

  void _startImport() {
    setState(() => _isImporting = true);

    // Simulate import progress
    Future.doWhile(() async {
      await Future.delayed(const Duration(milliseconds: 200));
      if (!mounted) return false;
      setState(() {
        _importProgress += 0.1;
      });
      return _importProgress < 1.0;
    }).then((_) {
      if (!mounted) return;
      setState(() => _isImporting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Import completed successfully!')),
      );
    });
  }
}

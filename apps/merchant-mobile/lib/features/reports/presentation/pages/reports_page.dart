import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/reports_service.dart';
import 'providers/reports_provider.dart';

class ReportsPage extends ConsumerStatefulWidget {
  const ReportsPage({Key? key}) : super(key: key);

  @override
  ConsumerState<ReportsPage> createState() => _ReportsPageState();
}

class _ReportsPageState extends ConsumerState<ReportsPage> {
  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _monthController = TextEditingController();
  final TextEditingController _yearController = TextEditingController();
  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _endDateController = TextEditingController();

  @override
  void dispose() {
    _dateController.dispose();
    _monthController.dispose();
    _yearController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reportsState = ref.watch(reportsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Daily Report Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Daily Report',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _dateController,
                      decoration: const InputDecoration(
                        labelText: 'Date (YYYY-MM-DD)',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        ElevatedButton(
                          onPressed: reportsState.isLoading
                              ? null
                              : () {
                                  ref
                                      .read(reportsProvider.notifier)
                                      .generateDailyReport(date: _dateController.text);
                                },
                          child: const Text('Generate'),
                        ),
                        const SizedBox(width: 8),
                        if (reportsState.isLoading)
                          const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                      ],
                    ),
                    if (reportsState.dailyReport != null) ...[
                      const SizedBox(height: 16),
                      const Text(
                        'Report Generated:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        reportsState.dailyReport.toString(),
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Monthly Report Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Monthly Report',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _monthController,
                            decoration: const InputDecoration(
                              labelText: 'Month (MM)',
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: _yearController,
                            decoration: const InputDecoration(
                              labelText: 'Year (YYYY)',
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: reportsState.isLoading
                                ? null
                                : () {
                                    ref.read(reportsProvider.notifier).generateMonthlyReport(
                                          month: _monthController.text,
                                          year: _yearController.text,
                                        );
                                  },
                            child: const Text('Generate'),
                          ),
                        ),
                        if (reportsState.isLoading)
                          const Padding(
                            padding: EdgeInsets.only(left: 8.0),
                            child: SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          ),
                      ],
                    ),
                    if (reportsState.monthlyReport != null) ...[
                      const SizedBox(height: 16),
                      const Text(
                        'Report Generated:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        reportsState.monthlyReport.toString(),
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Sales Report Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Sales Report',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _startDateController,
                            decoration: const InputDecoration(
                              labelText: 'Start Date (YYYY-MM-DD)',
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: _endDateController,
                            decoration: const InputDecoration(
                              labelText: 'End Date (YYYY-MM-DD)',
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: reportsState.isLoading
                                ? null
                                : () {
                                    ref.read(reportsProvider.notifier).generateSalesReport(
                                          startDate: _startDateController.text,
                                          endDate: _endDateController.text,
                                        );
                                  },
                            child: const Text('Generate'),
                          ),
                        ),
                        if (reportsState.isLoading)
                          const Padding(
                            padding: EdgeInsets.only(left: 8.0),
                            child: SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          ),
                      ],
                    ),
                    if (reportsState.salesReport != null) ...[
                      const SizedBox(height: 16),
                      const Text(
                        'Report Generated:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        reportsState.salesReport.toString(),
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Action Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: reportsState.isLoading ? null : () => ref.read(reportsProvider.notifier).clearReports(),
                  child: const Text('Clear Reports'),
                ),
                ElevatedButton.icon(
                  onPressed: reportsState.isLoading
                      ? null
                      : () {
                          // TODO: Implement export functionality
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Export functionality not implemented yet')),
                          );
                        },
                  icon: const Icon(Icons.download),
                  label: const Text('Export'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
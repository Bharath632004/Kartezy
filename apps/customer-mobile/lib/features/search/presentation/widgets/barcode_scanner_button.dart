// lib/features/search/presentation/widgets/barcode_scanner_button.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';

class BarcodeScannerButton extends ConsumerStatefulWidget {
  const BarcodeScannerButton({super.key});

  @override
  ConsumerState<BarcodeScannerButton> createState() => _BarcodeScannerButtonState();
}

class _BarcodeScannerButtonState extends ConsumerState<BarcodeScannerButton> {
  final bool _isScanning = false;
  String? _lastScannedCode;
  DateTime? _lastScanTime;

  void _startScanning() async {
    // Show a scanner overlay or navigate to a full-screen scanner
    // For simplicity, we'll show a dialog with the scanner
    await showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => AlertDialog(
        content: SizedBox(
          width: 300,
          height: 400,
          child: MobileScanner(
            onDetect: (capture) {
              final List<Barcode> barcodes = capture.barcodes;
              for (final barcode in barcodes) {
                if (barcode.rawValue != null) {
                  final String code = barcode.rawValue!;
                  // Avoid duplicate scans within 2 seconds
                  final now = DateTime.now();
                  if (_lastScannedCode == code &&
                      _lastScanTime != null &&
                      now.difference(_lastScanTime!) < const Duration(seconds: 2)) {
                    continue;
                  }
                  _lastScannedCode = code;
                  _lastScanTime = now;
                  // Close the dialog
                  if (context.mounted) {
                    Navigator.of(context).pop();
                  }
                  _scanBarcode(code);
                  break;
                }
              }
            },
          ),
        ),
      ),
    );
  }

  void _scanBarcode(String barcode) {
    if (barcode.trim().isNotEmpty) {
      // Save the barcode as a search query
      ref.read(saveSearchQueryUseCaseProvider)('barcode:$barcode');
      // Search for products by barcode
      ref.read(scanBarcodeUseCaseProvider)(barcode.trim());
      // Navigate to search results
      // Note: In a real app, we'd navigate to search results page
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: Icon(
            _isScanning ? Icons.qr_code_scanner : Icons.qr_code,
            color: _isScanning ? Theme.of(context).colorScheme.primary : null,
          ),
          onPressed: _startScanning,
          tooltip: 'Barcode Scanner',
        ),
        const SizedBox(height: 4),
        Text('Barcode', style: TextStyle(fontSize: 12)),
      ],
    );
  }
}

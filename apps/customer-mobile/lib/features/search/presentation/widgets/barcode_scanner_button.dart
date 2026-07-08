// lib/features/search/presentation/widgets/barcode_scanner_button.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class BarcodeScannerButton extends ConsumerStatefulWidget {
  const BarcodeScannerButton({super.key});

  @override
  ConsumerState<BarcodeScannerButton> createState() => _BarcodeScannerButtonState();
}

class _BarcodeScannerButtonState extends ConsumerState<BarcodeScannerButton> {
  bool _isScanning = false;

  void _toggleScanning() {
    setState(() => _isScanning = !_isScanning);
    // In a real app, you would start/stop barcode scanning here
    if (_isScanning) {
      // Start scanning
      // TODO: Implement barcode scanning
    } else {
      // Stop scanning
      // TODO: Stop barcode scanning
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
          onPressed: _toggleScanning,
          tooltip: 'Barcode Scanner',
        ),
        const SizedBox(height: 4),
        Text(
          'Barcode',
          style: TextStyle(fontSize: 12),
        ),
      ],
    );
  }
}
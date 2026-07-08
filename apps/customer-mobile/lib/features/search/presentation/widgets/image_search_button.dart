// lib/features/search/presentation/widgets/image_search_button.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ImageSearchButton extends ConsumerStatefulWidget {
  const ImageSearchButton({super.key});

  @override
  ConsumerState<ImageSearchButton> createState() => _ImageSearchButtonState();
}

class _ImageSearchButtonState extends ConsumerState<ImageSearchButton> {
  bool _isProcessing = false;

  void _pickImage() {
    setState(() => _isProcessing = true);
    // In a real app, you would open image picker here
    // For now, simulate the process
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() => _isProcessing = false);
        // TODO: Handle image search results
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: Icon(
            _isProcessing ? Icons.photo : Icons.photo_library,
            color: _isProcessing ? Theme.of(context).colorScheme.primary : null,
          ),
          onPressed: _pickImage,
          tooltip: 'Image Search',
        ),
        const SizedBox(height: 4),
        Text(
          'Image',
          style: TextStyle(fontSize: 12),
        ),
      ],
    );
  }
}
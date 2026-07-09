// lib/features/search/presentation/widgets/image_search_button.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';
import 'dart:io';

class ImageSearchButton extends ConsumerStatefulWidget {
  const ImageSearchButton({super.key});

  @override
  ConsumerState<ImageSearchButton> createState() => _ImageSearchButtonState();
}

class _ImageSearchButtonState extends ConsumerState<ImageSearchButton> {
  bool _isProcessing = false;

  Future<void> _pickImage() async {
    setState(() => _isProcessing = true);
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(source: ImageSource.gallery);
      
      if (image != null && mounted) {
        // Perform image search
        await _searchByImage(image.path);
      }
    } catch (e) {
      if (mounted) {
        // Handle error - in a real app, show a snackbar or dialog
        debugPrint('Error picking image: $e');
      }
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  Future<void> _searchByImage(String imagePath) async {
    // Save the image search as a query
    await ref.read(saveSearchQueryUseCaseProvider)('image:${imagePath.split('/').last}');
    // Perform the search by image
    await ref.read(searchByImageUseCaseProvider)(imagePath);
    // Navigate to search results
    // Note: In a real app, we'd navigate to search results page
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
          onPressed: _isProcessing ? null : _pickImage,
          tooltip: 'Image Search',
        ),
        const SizedBox(height: 4),
        Text('Image', style: TextStyle(fontSize: 12)),
      ],
    );
  }
}

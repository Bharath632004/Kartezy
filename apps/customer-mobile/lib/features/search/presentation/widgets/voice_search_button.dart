// lib/features/search/presentation/widgets/voice_search_button.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class VoiceSearchButton extends ConsumerStatefulWidget {
  const VoiceSearchButton({super.key});

  @override
  ConsumerState<VoiceSearchButton> createState() => _VoiceSearchButtonState();
}

class _VoiceSearchButtonState extends ConsumerState<VoiceSearchButton> {
  bool _isListening = false;

  void _toggleListening() {
    setState(() => _isListening = !_isListening);
    // In a real app, you would start/stop speech recognition here
    if (_isListening) {
      // Start listening
      // TODO: Implement speech recognition
    } else {
      // Stop listening and process results
      // TODO: Stop speech recognition and get results
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: Icon(
            _isListening ? Icons.mic : Icons.mic_none,
            color: _isListening ? Theme.of(context).colorScheme.primary : null,
          ),
          onPressed: _toggleListening,
          tooltip: 'Voice Search',
        ),
        const SizedBox(height: 4),
        Text('Voice', style: TextStyle(fontSize: 12)),
      ],
    );
  }
}

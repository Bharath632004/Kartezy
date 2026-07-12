// lib/features/search/presentation/widgets/voice_search_button.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';
import 'dart:developer';

class VoiceSearchButton extends ConsumerStatefulWidget {
  const VoiceSearchButton({super.key});

  @override
  ConsumerState<VoiceSearchButton> createState() => _VoiceSearchButtonState();
}

class _VoiceSearchButtonState extends ConsumerState<VoiceSearchButton> {
  bool _isListening = false;
  late SpeechToText _speech;
  String _lastWords = '';

  @override
  void initState() {
    super.initState();
    _initSpeech();
  }

  /// This has to happen only once per app
  void _initSpeech() async {
    _speech = SpeechToText();
    await _speech.initialize(
      onStatus: (val) => log('onStatus: $val'),
      onError: (val) => log('onError: $val'),
    );
    if (!mounted) return;
    setState(() {});
  }

  void _startListening() async {
    await _speech.listen(
      onResult: (val) => setState(() {
        _lastWords = val.recognizedWords ?? '';
        if (val.hasConfidenceRating && val.confidence > 0) {
          // If we have a confident result, use it to search
          if (val.finalResult || val.confidence > 0.8) {
            _performSearch(_lastWords);
          }
        }
      }),
    );
    if (!mounted) return;
    setState(() => _isListening = true);
  }

  void _stopListening() async {
    await _speech.stop();
    if (!mounted) return;
    setState(() => _isListening = false);
    // If we have a final result, use it to search
    if (_lastWords.isNotEmpty) {
      _performSearch(_lastWords);
    }
  }

  void _performSearch(String query) {
    if (query.trim().isNotEmpty) {
      // Save the search query
      ref.read(saveSearchQueryUseCaseProvider)(query.trim());
      // Perform the search
      ref.read(searchProductsUseCaseProvider)(query.trim());
      // Navigate to search results
      // Note: In a real app, we'd navigate to search results page
      // For now, we'll just update the search results provider
    }
  }

  @override
  void dispose() {
    _speech.stop();
    super.dispose();
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
          onPressed: _isListening ? _stopListening : _startListening,
          tooltip: 'Voice Search',
        ),
        const SizedBox(height: 4),
        Text('Voice', style: TextStyle(fontSize: 12)),
      ],
    );
  }
}

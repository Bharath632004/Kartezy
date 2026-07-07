// lib/shared/widgets/button.dart
import 'package:flutter/material.dart';
import 'package:customer_mobile/core/theme/theme_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// A customizable button widget
class AppButton extends ConsumerWidget {
  const AppButton({
    Key? key,
    required this.text,
    required this.onPressed,
    this.color,
    this.textColor,
    this.isLoading = false,
    this.disabled = false,
    this.borderRadius = 8.0,
    this.height = 48.0,
    this.width = double.infinity,
  }) : super(key: key);

  final String text;
  final VoidCallback onPressed;
  final Color? color;
  final Color? textColor;
  final bool isLoading;
  final bool disabled;
  final double borderRadius;
  final double height;
  final double width;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(themeProvider);
    final buttonColor = color ?? (disabled ? Colors.grey : theme.colorScheme.primary);
    final textColor = textColor ?? (disabled ? Colors.grey.shade400 : theme.colorScheme.onPrimary);

    return SizedBox(
      width: width,
      height: height,
      child: ElevatedButton(
        onPressed: disabled || isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: buttonColor,
          foregroundColor: textColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
          elevation: disabled ? 0 : 2,
        ),
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Text(text),
      ),
    );
  }
}
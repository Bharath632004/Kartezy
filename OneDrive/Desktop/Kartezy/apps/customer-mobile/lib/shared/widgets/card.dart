// lib/shared/widgets/card.dart
import 'package:flutter/material.dart';
import 'package:customer_mobile/core/theme/theme_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// A custom card widget with elevation and shadow
class AppCard extends ConsumerWidget {
  const AppCard({
    super.key,
    required this.child,
    this.elevation = 2,
    this.radius = 12,
    this.color,
    this.margin,
    this.padding,
  });

  final Widget child;
  final double elevation;
  final double radius;
  final Color? color;
  final EdgeInsetsGeometry? margin;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(themeProvider);
    final cardColor = color ?? theme.cardColor;

    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(radius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 6,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(radius),
        child: Material(
          color: Colors.transparent,
          elevation: elevation,
          child: Padding(
            padding: padding ?? const EdgeInsets.all(16.0),
            child: child,
          ),
        ),
      ),
    );
  }
}

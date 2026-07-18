import 'package:flutter/material.dart';

class ProductVariantSelector extends StatefulWidget {
  final List<ProductVariantGroup> variantGroups;
  final Map<String, String> selectedVariants;
  final ValueChanged<Map<String, String>> onVariantChanged;

  const ProductVariantSelector({
    super.key,
    required this.variantGroups,
    required this.selectedVariants,
    required this.onVariantChanged,
  });

  @override
  State<ProductVariantSelector> createState() => _ProductVariantSelectorState();
}

class _ProductVariantSelectorState extends State<ProductVariantSelector> {
  late Map<String, String> _selected;

  @override
  void initState() {
    super.initState();
    _selected = Map.from(widget.selectedVariants);
    if (_selected.isEmpty && widget.variantGroups.isNotEmpty) {
      for (final group in widget.variantGroups) {
        if (group.values.isNotEmpty) {
          _selected[group.name] = group.values.first;
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.variantGroups.isEmpty) {
      return const SizedBox.shrink();
    }

    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: widget.variantGroups.map((group) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    group.name,
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (_selected.containsKey(group.name))
                    Text(
                      ': ${_selected[group.name]}',
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w400,
                        color: Colors.grey[600],
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: group.values.map((value) {
                  final isSelected = _selected[group.name] == value;
                  return ChoiceChip(
                    label: Text(value),
                    selected: isSelected,
                    onSelected: (selected) {
                      if (selected) {
                        setState(() => _selected[group.name] = value);
                        widget.onVariantChanged(Map.from(_selected));
                      }
                    },
                    selectedColor: theme.primaryColor.withValues(alpha:0.1),
                    backgroundColor: Colors.grey[50],
                    side: BorderSide(
                      color: isSelected
                          ? theme.primaryColor
                          : Colors.grey[300]!,
                      width: isSelected ? 2 : 1,
                    ),
                    labelStyle: TextStyle(
                      color: isSelected ? theme.primaryColor : Colors.grey[700],
                      fontWeight: isSelected
                          ? FontWeight.w600
                          : FontWeight.w400,
                      fontSize: 13,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}

class ProductVariantGroup {
  final String name;
  final List<String> values;

  const ProductVariantGroup({required this.name, required this.values});
}

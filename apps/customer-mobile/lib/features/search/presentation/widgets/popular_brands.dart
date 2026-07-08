// lib/features/search/presentation/widgets/popular_brands.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Placeholder for popular brands - would typically come from a brands service
class PopularBrandsWidget extends ConsumerWidget {
  const PopularBrandsWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // In a real app, this would fetch from a brands service
    final List<Map<String, String>> popularBrands = [
      {
        'name': 'Nestle',
        'logo': 'https://via.placeholder.com/80x40?text=Nestle',
      },
      {'name': 'Amul', 'logo': 'https://via.placeholder.com/80x40?text=Amul'},
      {
        'name': 'Britannia',
        'logo': 'https://via.placeholder.com/80x40?text=Britannia',
      },
      {'name': 'Parle', 'logo': 'https://via.placeholder.com/80x40?text=Parle'},
      {'name': 'ITC', 'logo': 'https://via.placeholder.com/80x40?text=ITC'},
      {'name': 'Dabur', 'logo': 'https://via.placeholder.com/80x40?text=Dabur'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Popular Brands',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 60,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: popularBrands.length,
            itemBuilder: (context, index) {
              final brand = popularBrands[index];
              return Container(
                margin: const EdgeInsets.only(right: 8),
                child: Column(
                  children: [
                    Container(
                      width: 80,
                      height: 40,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                          color: Theme.of(context).dividerColor,
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: Image.network(
                          brand['logo']!,
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) =>
                              Container(
                                color: Theme.of(
                                  context,
                                ).colorScheme.secondaryContainer,
                                child: Icon(
                                  Icons.business,
                                  color: Theme.of(context).iconTheme.color,
                                ),
                              ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      brand['name']!,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

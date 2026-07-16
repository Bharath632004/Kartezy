import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class PopularBrands extends StatelessWidget {
  final void Function(String brandId)? onBrandTap;

  const PopularBrands({super.key, this.onBrandTap});

  @override
  Widget build(BuildContext context) {
    final brands = [
      Brand(
        name: 'Nestlé',
        logo:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Nestl%C3%A9_logo.svg/512px-Nestl%C3%A9_logo.svg.png',
      ),
      Brand(
        name: 'Amul',
        logo:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Amul_Logo.svg/512px-Amul_Logo.svg.png',
      ),
      Brand(
        name: 'Britannia',
        logo:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Britannia_Industries_logo.svg/512px-Britannia_Industries_logo.svg.png',
      ),
      Brand(
        name: 'Parle',
        logo:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Parle_Products_Logo.svg/512px-Parle_Products_Logo.svg.png',
      ),
      Brand(
        name: 'ITC',
        logo:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/ITC_Limited_Logo.svg/512px-ITC_Limited_Logo.svg.png',
      ),
      Brand(
        name: 'Dabur',
        logo:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dabur_logo.svg/512px-Dabur_logo.svg.png',
      ),
      Brand(
        name: 'Hindustan Unilever',
        logo:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Hindustan_Unilever_Logo.svg/512px-Hindustan_Unilever_Logo.svg.png',
      ),
      Brand(
        name: 'P&G',
        logo:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Procter_%26_Gamble_logo.svg/512px-Procter_%26_Gamble_logo.svg.png',
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            'Popular Brands',
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
        ),
        SizedBox(
          height: 72,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: brands.length,
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final brand = brands[index];
              return GestureDetector(
                onTap: () => onBrandTap?.call(brand.name),
                child: Container(
                  width: 100,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[200]!),
                    borderRadius: BorderRadius.circular(12),
                    color: Colors.white,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Expanded(
                        child: CachedNetworkImage(
                          imageUrl: brand.logo,
                          fit: BoxFit.contain,
                          errorWidget: (_, _, _) =>
                              Icon(Icons.business, color: Colors.grey[400]),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        brand.name,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class Brand {
  final String name;
  final String logo;

  const Brand({required this.name, required this.logo});
}

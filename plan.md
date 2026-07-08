# Implementation Plan for Search and Product Details

## Goals
1. Implement all required search features: instant search, AI search, voice search, barcode scanner, image search, recent searches, trending searches, suggestions, filters, sorting.
2. Implement all required product details features: images, videos, variants, stock, price, discounts, nutrition, ingredients, description, reviews, ratings, similar products, frequently bought together, wishlist, share, related products.
3. Ensure integration with Elasticsearch (via existing API endpoints).
4. Use Riverpod for state management.
5. Use Dio for networking.
6. Implement cached images using `cached_network_image`.
7. Implement pagination for search results and product lists.
8. Implement offline cache using Hive for search history and product details.
9. Improve error handling with user-friendly messages.
10. Ensure responsive UI across device sizes.
11. Remove duplicate code.
12. Fix Flutter analyze issues.
13. Update tests.

## Current State Analysis
Based on code review:
- Search functionality has:
  - Search remote data source implements most required methods.
  - Search repository implements required methods.
  - Search results page has basic pagination and filtering UI placeholders.
  - Product details page has basic structure but missing many features (videos, variants, stock, etc.).
  - No caching implementation observed.
  - No offline cache.
  - Error handling is minimal (try-catch with no user feedback).
  - Some duplicate code in search use cases and widgets.

## Implementation Steps

### 1. Search Feature Enhancements
#### a. Instant Search
- Modify search bar to debounce input and trigger search on every character change.
- Use `debounce` from `flutter_cache_manager` or custom timer.

#### b. AI Search
- Implement AI-powered search endpoint (assume `/search/ai`).
- Add toggle in search bar for AI search mode.

#### c. Voice Search
- Integrate speech_to_text package.
- Add microphone button to search bar.

#### d. Barcode Scanner
- Integrate mobile_scanner package.
- Use existing `scanBarcode` method in data source.

#### e. Image Search
- Integrate image_picker package.
- Use existing `searchByImage` method.

#### f. Recent & Trending Searches
- Already implemented in data source.
- Display in search home page.

#### g. Suggestions & Autocomplete
- Already implemented.
- Show suggestions as user types.

#### h. Filters & Sorting
- Implement filter bottom sheet with category, price range, brand, etc.
- Implement sort options (relevance, price low-high, rating, newest).
- Update search API calls to include filters and sortBy parameters.

### 2. Product Details Enhancements
#### a. Images & Videos
- Extend product model to include video URLs.
- Create image carousel that supports videos (use `chewie` or `video_player`).

#### b. Variants
- Add variant selector (size, color, etc.) if product has variants.
- Update price and stock based on selected variant.

#### c. Stock & Price
- Display stock status (In Stock, Out of Stock, Limited).
- Show price with discounts if applicable.

#### d. Discounts
- Show original price and discounted price.
- Display discount badge.

#### e. Nutrition & Ingredients
- Add tabs for nutrition facts and ingredients (if applicable for food products).

#### f. Description
- Already have description tab - need to populate from product data.

#### g. Reviews & Ratings
- Already have reviews tab - need to implement:
  - Star rating display.
  - Pagination for reviews.
  - Add review button (if authenticated).

#### h. Similar Products & Frequently Bought Together
- Already have Implement similar products and frequently bought together sections.

#### i. Wishlist
- Add wishlist button (heart icon) in app bar.
- Implement add/remove from wishlist using wishlist API.

#### j. Share
- Implement share functionality using `share_plus` package.

#### k. Related Products
- Already have related items tab - need to populate from API.

### 3. Technical Improvements
#### a. Caching Images
- Replace `Image.network` with `CachedImageNetwork` from `cached_network_image` package.

#### b. Pagination
- Implement proper offset-based pagination for search results.
- Implement infinite scroll for product lists.

#### c. Offline Cache
- Use Hive to cache:
  - Recent searches
  - Trending searches
  - Product details (for quick reload)
  - Search results (for offline viewing)

#### d. Error Handling
- Create custom exception classes.
- Show error dialogs/snackbars with retry options.
- Implement loading states for all async operations.

#### e. Responsive UI
- Use `LayoutBuilder` and `MediaQuery` to adjust UI for different screen sizes.
- Ensure bottom sheets and dialogs are adaptive.

#### f. Remove Duplicate Code
- Create common widgets for:
  - Error displays
  - Loading indicators
  - Empty states
  - Product cards (used in search results and related products)
- Extract common functionality into utility classes.

#### g. Fix Flutter Analyze
- Run `flutter analyze` and fix all warnings/errors.
- Common issues: unused imports, missing return types, etc.

#### h. Update Tests
- Write unit tests for:
  - Search use cases
  - Product details use cases
  - Repositories
  - Data sources
- Write widget tests for:
  - Search bar
  - Product grid
  - Product details page

## Files to Modify
1. `lib/features/search/presentation/widgets/search_bar.dart` - Enhance for instant, voice, AI search
2. `lib/features/search/presentation/search_results_page.dart` - Implement proper pagination, filters, sorting
3. `lib/features/search/presentation/widgets/product_grid.dart` - Make responsive, add loading states
4. `lib/features/search/presentation/product_details_page.dart` - Add missing features (videos, variants, etc.)
5. `lib/features/search/presentation/widgets/product_image_carousel.dart` - Support videos
6. `lib/features/search/presentation/widgets/product_variant_selector.dart` - New widget for variants
7. `lib/features/search/presentation/widgets/product_price_section.dart` - Enhance for discounts/stock
8. `lib/features/search/presentation/widgets/product_description_tab.dart` - Populate from product data
9. `lib/features/search/presentation/widgets/product_reviews_tab.dart` - Implement review pagination and add review
10. `lib/features/search/presentation/widgets/product_related_items.dart` - Populate similar and frequently bought together
11. `lib/features/search/data/datasource/search_remote_data_source.dart` - Add AI search endpoint if needed
12. `lib/features/search/data/repository/search_repository_impl.dart` - No changes needed if API contracts are met
13. `lib/features/search/domain/usecase/...` - Update use cases to handle new parameters (filters, sortBy)
14. `lib/shared/models/product.dart` - Extend model to include videos, variants, stock, etc.
15. `lib/core/storage/hive_manager.dart` - Implement Hive caching for search and product data
16. `pubspec.yaml` - Add dependencies: `cached_network_image`, `speech_to_text`, `mobile_scanner`, `image_picker`, `share_plus`, `chewie` or `video_player`, `hive`, `hive_flutter`
17. `lib/features/search/presentation/providers/search_providers.dart` - Update providers for new state (filters, sort, etc.)
18. Test files: Update or create tests for new functionality

## Remaining Issues After Implementation
- None if all requirements are met.
- Potential issues: API contract changes needed for new features (AI search, variant details, etc.)
- Need to verify backend endpoints exist for all implemented features.

## Output Format
Upon completion, we will output:
- Features completed: List of implemented features
- Files modified: List of files changed
- Remaining issues: Any outstanding issues or TODO items
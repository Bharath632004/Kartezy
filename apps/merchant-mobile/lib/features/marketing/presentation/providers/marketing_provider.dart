import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/marketing_service.dart';

final marketingProvider = StateNotifierProvider<MarketingNotifier, MarketingState>((ref) {
  return MarketingNotifier(ref.read(marketingServiceProvider));
});

class MarketingNotifier extends StateNotifier<MarketingState> {
  final MarketingService _marketingService;

  MarketingNotifier(this._marketingService) : super(const MarketingState());

  Future<void> loadSponsoredProducts() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final sponsoredProducts = await _marketingService.getSponsoredProducts();
      state = state.copyWith(isLoading: false, sponsoredProducts: sponsoredProducts);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadFeaturedProducts() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final featuredProducts = await _marketingService.getFeaturedProducts();
      state = state.copyWith(isLoading: false, featuredProducts: featuredProducts);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadBannerCampaigns() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final bannerCampaigns = await _marketingService.getBannerCampaigns();
      state = state.copyWith(isLoading: false, bannerCampaigns: bannerCampaigns);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

class MarketingState {
  final bool isLoading;
  final String? error;
  final List<dynamic>? sponsoredProducts;
  final List<dynamic>? featuredProducts;
  final List<dynamic>? bannerCampaigns;

  const MarketingState({
    this.isLoading = false,
    this.error,
    this.sponsoredProducts,
    this.featuredProducts,
    this.bannerCampaigns,
  });

  MarketingState copyWith({
    bool? isLoading,
    String? error,
    List<dynamic>? sponsoredProducts,
    List<dynamic>? featuredProducts,
    List<dynamic>? bannerCampaigns,
  }) {
    return MarketingState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      sponsoredProducts: sponsoredProducts ?? this.sponsoredProducts,
      featuredProducts: featuredProducts ?? this.featuredProducts,
      bannerCampaigns: bannerCampaigns ?? this.bannerCampaigns,
    );
  }
}
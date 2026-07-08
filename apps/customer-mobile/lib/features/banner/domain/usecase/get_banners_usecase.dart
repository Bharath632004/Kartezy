// lib/features/banner/domain/usecase/get_banners_usecase.dart
import 'package:customer_mobile/features/banner/domain/repository/banner_repository.dart';
import 'package:customer_mobile/features/banner/data/repository/banner_repository_impl.dart';
import 'package:customer_mobile/shared/models/banner.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetBannersUseCase {
  final BannerRepository _repository;

  GetBannersUseCase(this._repository);

  Future<List<Banner>> call() => _repository.getBanners();
}

/// Provider for get banners use case
final getBannersUseCaseProvider = Provider<GetBannersUseCase>((ref) {
  final repository = ref.read(bannerRepositoryProvider);
  return GetBannersUseCase(repository);
});

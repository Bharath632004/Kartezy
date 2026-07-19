// lib/features/banner/domain/usecase/get_banners_use_case.dart
import 'package:customer_mobile/features/banner/domain/repository/banner_repository.dart';
import 'package:customer_mobile/shared/models/banner.dart';

class GetBannersUseCase {
  final BannerRepository _repository;

  GetBannersUseCase(this._repository);

  Future<List<Banner>> call() => _repository.getBanners();
}

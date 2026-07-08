// lib/features/banner/domain/repository/banner_repository.dart
import 'package:customer_mobile/shared/models/banner.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class BannerRepository {
  Future<List<Banner>> getBanners();
}
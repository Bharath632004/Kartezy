// lib/features/search/domain/usecase/scan_barcode_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/data/repository/search_repository_impl.dart';

class ScanBarcodeUseCase {
  final SearchRepository _repository;

  ScanBarcodeUseCase(this._repository);

  Future<List<Product>> call(String barcode) {
    return _repository.scanBarcode(barcode);
  }
}

/// Provider for scan barcode use case
final scanBarcodeUseCaseProvider = Provider<ScanBarcodeUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return ScanBarcodeUseCase(repository);
});

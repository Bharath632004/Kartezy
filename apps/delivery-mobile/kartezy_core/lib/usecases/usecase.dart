// lib/core/usecases/usecase.dart
abstract class UseCase<T, Params> {
  Future<T> call(Params params);
}

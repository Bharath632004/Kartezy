// lib/core/usecases/usecase.dart
abstract class UseCase<Type, Params> {
  Future<Type> call(Params params);
}

// lib/core/usecases/usecase.dart
import 'package:equatable/equatable.dart';
import 'no_params.dart';

export 'no_params.dart';

abstract class UseCase<T, Params> {
  Future<T> call(Params params);
}

// Common failure class
abstract class Failure extends Equatable {
  const Failure();

  @override
  List<Object?> get props => [];
}
// lib/core/repository/base_repository.dart
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../error/failures.dart';

/// Helper function to convert DioException to Failure
Either<Failure, T> handleException<T>(Object error) {
  if (error is DioException) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return Left(ServerFailure(message: 'Connection timeout'));
      case DioExceptionType.badResponse:
        return Left(
          ServerFailure(message: 'Bad response: ${error.response?.statusCode}'),
        );
      case DioExceptionType.connectionError:
        return Left(ServerFailure(message: 'Connection error'));
      case DioExceptionType.unknown:
        if (error.message?.contains('SocketException') ?? false) {
          return Left(ServerFailure(message: 'No internet connection'));
        }
        return Left(ServerFailure(message: 'Unexpected error: ${error.message}'));
      default:
        return Left(ServerFailure(message: 'Something went wrong'));
    }
  } else {
    return Left(ServerFailure(message: error.toString()));
  }
}

abstract class BaseRepository {
  // This class can be extended by repositories to provide common error handling.
}

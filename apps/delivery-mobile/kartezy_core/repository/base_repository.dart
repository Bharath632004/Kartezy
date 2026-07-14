// lib/core/repository/base_repository.dart
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../error/failures.dart';

abstract class BaseRepository {
  // This class can be extended by repositories to provide common error handling.
  // For example, a method to convert DioException to Failure.
  Either<Failure, T> _handleException<T>(Object error) {
    if (error is DioException) {
      // Handle common Dio errors
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.receiveTimeout:
        case DioExceptionType.sendTimeout:
          return Left(Failure(message: 'Connection timeout'));
        case DioExceptionType.badResponse:
          return Left(
            Failure(message: 'Bad response: ${error.response?.statusCode}'),
          );
        case DioExceptionType.cancelled:
          return Left(Failure(message: 'Request cancelled'));
        case DioExceptionType.unknown:
          if (error.message!.contains('SocketException')) {
            return Left(Failure(message: 'No internet connection'));
          }
          return Left(Failure(message: 'Unexpected error: ${error.message}'));
        default:
          return Left(Failure(message: 'Something went wrong'));
      }
    } else {
      return Left(Failure(message: error.toString()));
    }
  }
}

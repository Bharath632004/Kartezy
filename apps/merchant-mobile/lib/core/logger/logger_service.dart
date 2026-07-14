import 'package:logger/logger.dart';
import 'package:flutter/foundation.dart';

class LoggerService {
  LoggerService._();

  static final LoggerService _instance = LoggerService._();
  static LoggerService get instance => _instance;

  late final Logger _logger;

  void init() {
    if (kReleaseMode) {
      // In release mode, we only want to log warnings and errors
      _logger = Logger(
        filter: DevelopmentFilter(), // logs only in debug
        printer: PrettyPrinter(methodCount: 0),
      );
    } else {
      // In debug mode, log everything
      _logger = Logger(
        printer: PrettyPrinter(
          methodCount: 2,
          colors: true,
          printEmojis: true,
          dateTimeFormat: DateTimeFormat.onlyTimeAndSinceStart,
        ),
      );
    }
  }

  void t(String message, {Object? error, StackTrace? stackTrace}) {
    _logger.t(message, error: error, stackTrace: stackTrace);
  }

  void d(String message, {Object? error, StackTrace? stackTrace}) {
    _logger.d(message, error: error, stackTrace: stackTrace);
  }

  void i(String message, {Object? error, StackTrace? stackTrace}) {
    _logger.i(message, error: error, stackTrace: stackTrace);
  }

  void w(String message, {Object? error, StackTrace? stackTrace}) {
    _logger.w(message, error: error, stackTrace: stackTrace);
  }

  void e(String message, {Object? error, StackTrace? stackTrace}) {
    _logger.e(message, error: error, stackTrace: stackTrace);
  }

  void f(String message, {Object? error, StackTrace? stackTrace}) {
    _logger.f(message, error: error, stackTrace: stackTrace);
  }
}

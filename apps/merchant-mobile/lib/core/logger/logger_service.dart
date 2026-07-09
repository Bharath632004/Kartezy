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

  void v(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.v(message, error, stackTrace);
  }

  void d(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.d(message, error, stackTrace);
  }

  void i(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.i(message, error, stackTrace);
  }

  void w(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.w(message, error, stackTrace);
  }

  void e(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.e(message, error, stackTrace);
  }

  void wtf(String message, [dynamic error, StackTrace? stackTrace]) {
    // wtf is deprecated, use nothing or just log as error with a message
    _logger.wtf(message, error, stackTrace);
  }
}
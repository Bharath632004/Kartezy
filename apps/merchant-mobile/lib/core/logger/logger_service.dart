import 'package:logger/logger.dart';

class LoggerService {
  LoggerService._();

  static final LoggerService _instance = LoggerService._();
  static LoggerService get instance => _instance;

  late final Logger _logger;

  LoggerService._internal() {
    _logger = Logger(
      printer: PrettyPrinter(
        methodCount: 2,
        colors: true,
        printEmojis: true,
        printTime: true,
      ),
    );
  }

  factory LoggerService() {
    return _instance;
  }

  Logger get logger => _logger;

  void init() {
    // If in release mode, we might want to log less
    if (!kReleaseMode) {
      _logger = Logger(
        printer: PrettyPrinter(
          methodCount: 2,
          colors: true,
          printEmojis: true,
          printTime: true,
        ),
      );
    } else {
      _logger = Logger(
        filter: null, // Use default LogFilter (-> only log level > debug)
        printer: PrettyPrinter(methodCount: 0),
      );
    }
  }

  void d(Object? object, {int? time, Object? error, StackTrace? stackTrace}) {
    _logger.d(object, time: time, error: error, stackTrace: stackTrace);
  }

  void e(Object? object, {int? time, Object? error, StackTrace? stackTrace}) {
    _logger.e(object, time: time, error: error, stackTrace: stackTrace);
  }

  void f(Object? object, {int? time, Object? error, StackTrace? stackTrace}) {
    _logger.f(object, time: time, error: error, stackTrace: stackTrace);
  }

  void i(Object? object, {int? time, Object? error, StackTrace? stackTrace}) {
    _logger.i(object, time: time, error: error, stackTrace: stackTrace);
  }

  void w(Object? object, {int? time, Object? error, StackTrace? stackTrace}) {
    _logger.w(object, time: time, error: error, stackTrace: stackTrace);
  }

  void wtf(Object? object, {int? time, Object? error, StackTrace? stackTrace}) {
    _logger.wtf(object, time: time, error: error, stackTrace: stackTrace);
  }
}
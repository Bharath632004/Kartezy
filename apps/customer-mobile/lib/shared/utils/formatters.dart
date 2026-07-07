// lib/shared/utils/formatters.dart
import 'package:intl/intl.dart';

/// Utility class for formatting numbers, dates, etc.
class Formatters {
  static final NumberFormat _currencyFormat = NumberFormat.currency(
    symbol: '₹',
    decimalDigits: 2,
  );

  static final DateFormat _dateFormat = DateFormat('dd MMM, yyyy');
  static final DateFormat _timeFormat = DateFormat('hh:mm a');
  static final DateFormat _dateTimeFormat = DateFormat('dd MMM, yyyy hh:mm a');

  /// Format a number as currency (INR)
  static String formatCurrency(double amount) {
    return _currencyFormat.format(amount);
  }

  /// Format a date to a short string (e.g., "25 Dec, 2023")
  static String formatDate(DateTime date) {
    return _dateFormat.format(date);
  }

  /// Format a time to a short string (e.g., "02:30 PM")
  static String formatTime(DateTime time) {
    return _timeFormat.format(time);
  }

  /// Format a date and time to a string (e.g., "25 Dec, 2023 02:30 PM")
  static String formatDateTime(DateTime dateTime) {
    return _dateTimeFormat.format(dateTime);
  }

  /// Format a phone number (assuming Indian format)
  static String formatPhoneNumber(String number) {
    if (number.length == 10) {
      return '${number.substring(0, 5)} ${number.substring(5)}';
    }
    return number;
  }
}
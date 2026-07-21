// lib/core/utils/formatters.dart
import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

String formatDate(DateTime date, {String pattern = 'dd MMM yyyy'}) {
  return DateFormat(pattern).format(date);
}

String formatTimeOfDay(TimeOfDay timeOfDay) {
  final now = DateTime.now();
  final dateTime = DateTime(
    now.year,
    now.month,
    now.day,
    timeOfDay.hour,
    timeOfDay.minute,
  );
  return DateFormat.jm().format(dateTime); // e.g., 4:30 PM
}

String formatCurrency(
  double amount, {
  String symbol = '₹',
  int decimalPlaces = 2,
}) {
  return '$symbol${amount.toStringAsFixed(decimalPlaces)}';
}

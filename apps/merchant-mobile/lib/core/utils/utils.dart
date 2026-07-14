import 'package:flutter/material.dart';
import 'package:merchant_mobile/core/error/exceptions.dart';

String getErrorMessage(Object error) {
  if (error is AppException) {
    return error.toString();
  }
  return error.toString();
}

String formatCurrency(double amount, {String currency = '₹'}) {
  return '$currency ${amount.toStringAsFixed(2)}';
}

String formatDateTime(DateTime dateTime) {
  return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute}';
}

bool isEmailValid(String email) {
  return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
}

bool isPhoneNumberValid(String phone) {
  return RegExp(r'^[0-9]{10}$').hasMatch(phone);
}

void showSnackBar(
  BuildContext context,
  String message, {
  bool isError = false,
}) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
      backgroundColor: isError ? Colors.red : Colors.green,
    ),
  );
}

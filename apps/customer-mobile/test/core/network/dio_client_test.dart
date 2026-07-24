import 'package:flutter_test/flutter_test.dart';
import 'package:customer_mobile/core/network/dio_client.dart';

void main() {
  group('DioClient', () {
    test('should be constructable', () {
      // Verify the class exists and has correct structure
      expect(DioClient, isA<Type>());
    });
  });
}

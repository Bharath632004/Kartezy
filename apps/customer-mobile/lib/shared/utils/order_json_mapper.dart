// lib/shared/utils/order_json_mapper.dart
// Shared utility to normalize backend OrderEnhancedDto JSON to mobile Order model format.
// Both OrderRemoteDataSource and CheckoutRemoteDataSource use this to map
// the backend response to the local Order model.

/// Normalizes backend OrderEnhancedDto JSON to mobile Order model format.
Map<String, dynamic> normalizeOrderJson(dynamic raw) {
  if (raw is! Map<String, dynamic>) return {'id': '', 'items': <dynamic>[]};
  final json = Map<String, dynamic>.from(raw);

  // Map backend fields to mobile model fields
  json['orderStatus'] = json['status'] ?? json['orderStatus'] ?? 'PENDING';
  json.remove('status');

  // Map delivery info into deliveryAddress
  if (json['deliveryInfo'] is Map<String, dynamic>) {
    final di = Map<String, dynamic>.from(json['deliveryInfo']);
    json['deliveryAddress'] = {
      'id': '',
      'addressLine1': di['deliveryAddress'] ?? '',
      'addressLine2': '',
      'city': di['deliveryCity'] ?? '',
      'state': di['deliveryState'] ?? '',
      'pincode': di['deliveryPincode'] ?? '',
      'latitude': _toDouble(di['deliveryLatitude']),
      'longitude': _toDouble(di['deliveryLongitude']),
      'isDefault': true,
      'label': 'Home',
    };
  }

  // Map items from OrderItemEnhancedDto to mobile OrderItem
  if (json['items'] is List) {
    json['items'] = (json['items'] as List).map((item) {
      if (item is! Map<String, dynamic>) return item;
      return {
        'id': item['id']?.toString() ?? '',
        'productId': item['productId']?.toString() ?? '',
        'productName': item['productName'] ?? '',
        'price': _toDouble(item['unitPrice']),
        'quantity': item['quantity'] ?? 1,
        'selectedVariants': item['variantName'] != null
            ? {'variant': item['variantName']}
            : <String, String>{},
        'total': _toDouble(item['totalPrice']),
        'product': {
          'id': item['productId']?.toString() ?? '',
          'name': item['productName'] ?? '',
          'description': '',
          'shortDescription': '',
          'price': _toDouble(item['unitPrice']),
          'compareAtPrice': null,
          'imageUrl': item['productImage'] ?? '',
          'images': <String>[],
          'stock': 1,
          'tags': <String>[],
        },
      };
    }).toList();
  }

  // Ensure required fields exist
  json['id'] = json['id']?.toString() ?? '';
  json['userId'] = json['userId']?.toString();
  json['cartId'] = json['cartId'] ?? '';
  json['itemCount'] =
      json['itemCount'] ?? (json['items'] as List?)?.length ?? 0;
  json['totalAmount'] = _toDouble(json['totalAmount']);
  json['discountAmount'] = _toDouble(json['discount']);
  json['deliveryCharges'] = _toDouble(json['deliveryFee']);
  json['platformFee'] = _toDouble(json['platformFee']);
  json['packagingFee'] = _toDouble(json['packagingFee'] ?? 0);
  json['gstAmount'] = _toDouble(json['tax']);
  json['tipAmount'] = _toDouble(json['tipAmount'] ?? 0);
  json['walletAmount'] = _toDouble(json['walletAmount'] ?? 0);
  json['netAmount'] = _toDouble(json['totalAmount']);

  // Payment info
  json['paymentMethod'] = json['paymentMethod'] ?? 'COD';
  json['paymentStatus'] = json['paymentStatus'] ?? 'PENDING';
  json['deliveryInstructions'] = json['deliveryInstructions'] ?? json['notes'];
  json['contactlessDelivery'] = json['contactlessDelivery'] ?? false;

  // Timestamps
  json['createdAt'] = json['createdAt'] ?? DateTime.now().toIso8601String();
  json['updatedAt'] = json['updatedAt'] ?? DateTime.now().toIso8601String();
  json['estimatedDeliveryTime'] =
      json['estimatedDeliveryTime'] ??
      DateTime.now().add(const Duration(minutes: 30)).toIso8601String();

  return json;
}

double _toDouble(dynamic value) {
  if (value == null) return 0.0;
  if (value is num) return value.toDouble();
  if (value is String) return double.tryParse(value) ?? 0.0;
  return 0.0;
}

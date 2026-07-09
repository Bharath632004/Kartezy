import 'package:equatable/equatable.dart';

class MerchantProfile extends Equatable {
  final String? storeName;
  final String? ownerName;
  final String? mobile;
  final String? email;
  final String? gst;
  final String? pan;
  final String? aadhaar;
  final String? bankAccount;
  final String? ifsc;
  final String? upiId;
  final String? businessCategory;
  final String? businessType;
  final String? storeAddress;
  final double? latitude;
  final double? longitude;
  final String? businessHours;
  final double? deliveryRadius;
  final double? minimumOrder;
  final List<String>? storeImages;
  final String? storeLogo;
  final List<String>? documents;

  const MerchantProfile({
    this.storeName,
    this.ownerName,
    this.mobile,
    this.email,
    this.gst,
    this.pan,
    this.aadhaar,
    this.bankAccount,
    this.ifsc,
    this.upiId,
    this.businessCategory,
    this.businessType,
    this.storeAddress,
    this.latitude,
    this.longitude,
    this.businessHours,
    this.deliveryRadius,
    this.minimumOrder,
    this.storeImages,
    this.storeLogo,
    this.documents,
  });

  Map<String, dynamic> toJson() {
    return {
      'store_name': storeName,
      'owner_name': ownerName,
      'mobile': mobile,
      'email': email,
      'gst': gst,
      'pan': pan,
      'aadhaar': aadhaar,
      'bank_account': bankAccount,
      'ifsc': ifsc,
      'upi_id': upiId,
      'business_category': businessCategory,
      'business_type': businessType,
      'store_address': storeAddress,
      'latitude': latitude,
      'longitude': longitude,
      'business_hours': businessHours,
      'delivery_radius': deliveryRadius,
      'minimum_order': minimumOrder,
      'store_images': storeImages,
      'store_logo': storeLogo,
      'documents': documents,
    };
  }

  factory MerchantProfile.fromJson(Map<String, dynamic> json) {
    return MerchantProfile(
      storeName: json['store_name'],
      ownerName: json['owner_name'],
      mobile: json['mobile'],
      email: json['email'],
      gst: json['gst'],
      pan: json['pan'],
      aadhaar: json['aadhaar'],
      bankAccount: json['bank_account'],
      ifsc: json['ifsc'],
      upiId: json['upi_id'],
      businessCategory: json['business_category'],
      businessType: json['business_type'],
      storeAddress: json['store_address'],
      latitude: json['latitude'],
      longitude: json['longitude'],
      businessHours: json['business_hours'],
      deliveryRadius: json['delivery_radius'],
      minimumOrder: json['minimum_order'],
      storeImages: json['store_images'] != null ? List<String>.from(json['store_images']) : null,
      storeLogo: json['store_logo'],
      documents: json['documents'] != null ? List<String>.from(json['documents']) : null,
    );
  }

  @override
  List<Object?> get props => [
        storeName,
        ownerName,
        mobile,
        email,
        gst,
        pan,
        aadhaar,
        bankAccount,
        ifsc,
        upiId,
        businessCategory,
        businessType,
        storeAddress,
        latitude,
        longitude,
        businessHours,
        deliveryRadius,
        minimumOrder,
        storeImages,
        storeLogo,
        documents,
      ];
}
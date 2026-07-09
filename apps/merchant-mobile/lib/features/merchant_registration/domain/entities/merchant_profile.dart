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
  final String? kycStatus; // pending, approved, rejected, resubmission

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
    this.kycStatus,
  });

  factory MerchantProfile.fromJson(Map<String, dynamic> json) => MerchantProfile(
        storeName: json['store_name'] as String?,
        ownerName: json['owner_name'] as String?,
        mobile: json['mobile'] as String?,
        email: json['email'] as String?,
        gst: json['gst'] as String?,
        pan: json['pan'] as String?,
        aadhaar: json['aadhaar'] as String?,
        bankAccount: json['bank_account'] as String?,
        ifsc: json['ifsc'] as String?,
        upiId: json['upi_id'] as String?,
        businessCategory: json['business_category'] as String?,
        businessType: json['business_type'] as String?,
        storeAddress: json['store_address'] as String?,
        latitude: (json['latitude'] as num?)?.toDouble(),
        longitude: (json['longitude'] as num?)?.toDouble(),
        businessHours: json['business_hours'] as String?,
        deliveryRadius: (json['delivery_radius'] as num?)?.toDouble(),
        minimumOrder: (json['minimum_order'] as num?)?.toDouble(),
        storeImages: (json['store_images'] as List<dynamic>?)
            ?.map((e) => e as String)
            .toList(),
        storeLogo: json['store_logo'] as String?,
        documents: (json['documents'] as List<dynamic>?)
            ?.map((e) => e as String)
            .toList(),
        kycStatus: json['kyc_status'] as String?,
      );

  Map<String, dynamic> toJson() => {
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
        'kyc_status': kycStatus,
      };

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
        kycStatus,
      ];
}
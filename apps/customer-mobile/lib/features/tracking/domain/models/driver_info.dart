class DriverInfo {
  final String id;
  final String name;
  final String? photoUrl;
  final String vehicleNumber;
  final String vehicleType;
  final double rating;
  final String phoneNumber; // for contact

  const DriverInfo({
    required this.id,
    required this.name,
    this.photoUrl,
    required this.vehicleNumber,
    required this.vehicleType,
    required this.rating,
    required this.phoneNumber,
  });

  factory DriverInfo.fromJson(Map<String, dynamic> json) {
    return DriverInfo(
      id: json['id'] as String,
      name: json['name'] as String,
      photoUrl: json['photoUrl'] as String?,
      vehicleNumber: json['vehicleNumber'] as String,
      vehicleType: json['vehicleType'] as String,
      rating: (json['rating'] as num).toDouble(),
      phoneNumber: json['phoneNumber'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'photoUrl': photoUrl,
    'vehicleNumber': vehicleNumber,
    'vehicleType': vehicleType,
    'rating': rating,
    'phoneNumber': phoneNumber,
  };
}

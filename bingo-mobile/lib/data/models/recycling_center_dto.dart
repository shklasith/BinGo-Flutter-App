import '../../domain/entities/recycling_center.dart';

class RecyclingCenterDto {
  const RecyclingCenterDto({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.acceptedMaterials,
    required this.operatingHours,
    required this.contactNumber,
  });

  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final List<String> acceptedMaterials;
  final String operatingHours;
  final String contactNumber;

  factory RecyclingCenterDto.fromJson(Map<String, dynamic> json) {
    final location = json['location'] as Map<String, dynamic>?;
    final coordinates =
        (location?['coordinates'] as List<dynamic>? ?? <dynamic>[]);
    final lng = coordinates.isNotEmpty
        ? (coordinates[0] as num? ?? 0).toDouble()
        : 0.0;
    final lat = coordinates.length > 1
        ? (coordinates[1] as num? ?? 0).toDouble()
        : 0.0;

    return RecyclingCenterDto(
      id: (json['_id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      address: (json['address'] ?? '').toString(),
      latitude: lat,
      longitude: lng,
      acceptedMaterials:
          (json['acceptedMaterials'] as List<dynamic>? ?? <dynamic>[])
              .map((dynamic item) => item.toString())
              .toList(),
      operatingHours: (json['operatingHours'] ?? '').toString(),
      contactNumber: (json['contactNumber'] ?? '').toString(),
    );
  }

  RecyclingCenter toEntity() => RecyclingCenter(
    id: id,
    name: name,
    address: address,
    latitude: latitude,
    longitude: longitude,
    acceptedMaterials: acceptedMaterials,
    operatingHours: operatingHours,
    contactNumber: contactNumber,
  );
}

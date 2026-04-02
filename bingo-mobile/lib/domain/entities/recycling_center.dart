class RecyclingCenter {
  const RecyclingCenter({
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
}

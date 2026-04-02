import '../entities/recycling_center.dart';

abstract class CenterRepository {
  Future<List<RecyclingCenter>> getNearby(double lat, double lng, int radius);
}

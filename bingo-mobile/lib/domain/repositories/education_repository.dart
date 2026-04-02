import '../entities/daily_tip.dart';

abstract class EducationRepository {
  Future<DailyTip> getDailyTip();
  Future<List<DailyTip>> searchTips(String query);
}

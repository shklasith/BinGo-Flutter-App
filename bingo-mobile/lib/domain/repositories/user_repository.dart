import '../entities/app_user.dart';

abstract class UserRepository {
  Future<AppUser> getProfile(String userId);
}

import '../entities/app_user.dart';

abstract class AuthRepository {
  Future<AppUser> register(String username, String email, String password);
  Future<AppUser> login(String email, String password);
}

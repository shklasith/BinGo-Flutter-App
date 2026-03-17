abstract class SessionRepository {
  Future<String?> getUserId();
  Future<String?> getToken();
  Future<void> setUserId(String userId);
  Future<void> setToken(String token);
  Future<void> setSession(String userId, String token);
  Future<void> clear();
}

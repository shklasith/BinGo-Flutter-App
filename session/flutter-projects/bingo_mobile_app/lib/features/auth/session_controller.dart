class SessionController {
  Future<String?> getCurrentUserId() async {
    await Future.delayed(const Duration(seconds: 2));

    // Change this to test navigation
    return null; // or return 'user123';
  }
}
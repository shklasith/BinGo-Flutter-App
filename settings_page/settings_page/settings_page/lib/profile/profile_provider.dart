class UserProfile {
  final String username;
  final String email;

  const UserProfile({
    required this.username,
    required this.email,
  });
}

class ProfileService {
  /// Simulates a network call — replace with your real API call.
  Future<UserProfile> fetchProfile() async {
    await Future<void>.delayed(const Duration(milliseconds: 400));

    // TODO: Replace with actual API/auth response.
    return const UserProfile(
      username: 'John Doe',
      email: 'john@example.com',
    );
  }
}

// Single shared instance — swap for dependency injection if needed.
final profileService = ProfileService();

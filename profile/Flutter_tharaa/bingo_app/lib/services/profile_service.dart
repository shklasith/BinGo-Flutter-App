import '../domain/entities/app_user.dart';

class ProfileService {

  Future<AppUser> fetchUser() async {
    await Future.delayed(const Duration(seconds: 1));

    return AppUser(
      username: "Sameeksha",
      points: 120,
      badges: [
        "Glass Guardian",
        "Plastic Hero",
        "Compost Pro"
      ],
    );
  }

  Future<dynamic> getUserProfile() async {}

}
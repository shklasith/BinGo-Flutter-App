class Validators {
  static String? validateEmail(String value) {
    if (value.isEmpty) return 'Enter email';
    if (!value.contains('@')) return 'Invalid email';
    return null;
  }

  static String? validatePassword(String value) {
    if (value.isEmpty) return 'Enter password';
    if (value.length < 6) return 'Minimum 6 characters';
    return null;
  }
}
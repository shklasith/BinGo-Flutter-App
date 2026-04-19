import 'package:flutter/material.dart';

const Color kMintBackground = Color(0xFFDDEBE0);
const Color kPrimaryGreen = Color(0xFF1FA53D);
const Color kDeepText = Color(0xFF0D3B2B);
const Color kInputFill = Color(0xFFF4F4F4);

class AuthLogo extends StatelessWidget {
  const AuthLogo({super.key, required this.showMenu});

  static const String _logoAssetPath = 'assets/images/logo.png';

  final bool showMenu;

  @override
  Widget build(BuildContext context) {
    final shortSide = MediaQuery.sizeOf(context).shortestSide;
    final logoWidth = (shortSide * 0.8).clamp(290.0, 360.0);

    return Column(
      children: [
        Align(
          alignment: Alignment.topRight,
          child: showMenu
              ? const Icon(
                  Icons.format_list_bulleted,
                  color: kPrimaryGreen,
                  size: 28,
                )
              : const SizedBox(height: 28),
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: logoWidth,
          height: logoWidth * 0.66,
          child: ClipRect(
            child: Align(
              alignment: Alignment.topCenter,
              heightFactor: 0.66,
              child: Image.asset(
                _logoAssetPath,
                width: logoWidth,
                fit: BoxFit.fitWidth,
                errorBuilder: (_, error, stackTrace) {
                  return Column(
                    children: const [
                      Icon(Icons.recycling, color: kPrimaryGreen, size: 72),
                      SizedBox(height: 8),
                      Text(
                        'BinGo',
                        style: TextStyle(
                          fontSize: 34,
                          letterSpacing: 0.8,
                          fontWeight: FontWeight.w600,
                          color: kDeepText,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'BIN IT RIGHT',
                        style: TextStyle(
                          fontSize: 13,
                          letterSpacing: 2.8,
                          fontWeight: FontWeight.w500,
                          color: kDeepText,
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class AuthTextField extends StatelessWidget {
  const AuthTextField({
    super.key,
    required this.label,
    required this.hint,
    required this.controller,
    this.keyboardType,
    this.obscureText = false,
  });

  final String label;
  final String hint;
  final TextEditingController controller;
  final TextInputType? keyboardType;
  final bool obscureText;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: kPrimaryGreen,
            fontSize: 21,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.1,
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          obscureText: obscureText,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(
              color: Colors.black.withValues(alpha: 0.45),
              fontSize: 15,
            ),
            filled: true,
            fillColor: Colors.white.withValues(alpha: 0.82),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 18,
              vertical: 20,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: kPrimaryGreen, width: 1.3),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: kPrimaryGreen, width: 1.3),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: kPrimaryGreen, width: 1.9),
            ),
          ),
        ),
      ],
    );
  }
}

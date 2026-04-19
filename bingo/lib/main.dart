import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'authentication/auth_shared.dart';
import 'authentication/login_page.dart';
import 'authentication/signup_page.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const BingoApp());
}

class BingoApp extends StatelessWidget {
  const BingoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'BinGo',
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: kMintBackground,
        colorScheme: ColorScheme.fromSeed(seedColor: kPrimaryGreen),
        fontFamily: 'Georgia',
      ),
      home: const FirebaseGate(),
    );
  }
}

class FirebaseGate extends StatelessWidget {
  const FirebaseGate({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: Firebase.initializeApp(),
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(color: kPrimaryGreen),
            ),
          );
        }

        if (snapshot.hasError) {
          return Scaffold(
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  'Firebase is not configured yet. Add Firebase app config files and restart the app.\n\n${snapshot.error}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16, color: kDeepText),
                ),
              ),
            ),
          );
        }

        return const AuthShell();
      },
    );
  }
}

class AuthShell extends StatefulWidget {
  const AuthShell({super.key});

  @override
  State<AuthShell> createState() => _AuthShellState();
}

class _AuthShellState extends State<AuthShell> {
  bool _isLogin = true;

  void _switchToSignUp() {
    setState(() {
      _isLogin = false;
    });
  }

  void _switchToLogin() {
    setState(() {
      _isLogin = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return _isLogin
        ? LoginPage(onSwitchToSignUp: _switchToSignUp)
        : SignUpPage(onSwitchToLogin: _switchToLogin);
  }
}

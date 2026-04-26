import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/network/api_client.dart';
import '../register/auth_text_field.dart';
import '../register/validators.dart';
import '../session/session_store.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _apiClient = ApiClient();
  final _sessionStore = SessionStore();

  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final data = await _apiClient.post(
        '/api/users/login',
        body: <String, dynamic>{
          'email': _emailController.text.trim(),
          'password': _passwordController.text,
        },
      );

      final userId = data['_id']?.toString() ?? '';
      final token = data['token']?.toString() ?? '';
      if (userId.isEmpty || token.isEmpty) {
        throw const ApiException('Login response did not include a session.');
      }

      await _sessionStore.saveSession(userId: userId, token: token);

      if (!mounted) return;
      context.go('/home');
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Login failed: $error')));
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _skipIfAlreadyLoggedIn() async {
    if (await _sessionStore.hasSession()) {
      if (!mounted) return;
      context.go('/home');
    }
  }

  @override
  void initState() {
    super.initState();
    _skipIfAlreadyLoggedIn();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Welcome back')),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.recycling, size: 54, color: Color(0xFF16A34A)),
                const SizedBox(height: 14),
                const Text(
                  'Save your BinGo progress',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Log in to keep points, scan history, and profile details synced.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF6B7280), fontSize: 15),
                ),
                const SizedBox(height: 28),
                AuthTextField(
                  controller: _emailController,
                  label: 'Email',
                  validator: Validators.email,
                ),
                const SizedBox(height: 12),
                AuthTextField(
                  controller: _passwordController,
                  label: 'Password',
                  obscure: true,
                  validator: Validators.password,
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _isLoading ? null : _login,
                  child: _isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Login'),
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () => context.go('/register'),
                  child: const Text('Create an account'),
                ),
                TextButton(
                  onPressed: () => context.go('/home'),
                  child: const Text('Continue without account'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

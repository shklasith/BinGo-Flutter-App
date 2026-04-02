import 'package:bingo_mobile/presentation/auth/login_screen.dart';
import 'package:bingo_mobile/presentation/auth/signup_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('renders signup form controls', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: SignupScreen())),
    );

    expect(find.text('Create Account'), findsWidgets);
    expect(find.byType(TextFormField), findsNWidgets(3));
    expect(find.byType(ElevatedButton), findsOneWidget);
  });

  testWidgets('renders login form controls', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: LoginScreen())),
    );

    expect(find.text('Welcome to BinGo'), findsOneWidget);
    expect(find.byType(TextFormField), findsNWidgets(2));
    expect(find.byType(ElevatedButton), findsOneWidget);
  });
}

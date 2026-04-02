import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets(
    'happy path register->scan->profile (manual backend required)',
    (tester) async {},
    skip: true,
  );
}

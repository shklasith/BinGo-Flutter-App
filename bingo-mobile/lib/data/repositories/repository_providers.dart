import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/dio_client.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/repositories/center_repository.dart';
import '../../domain/repositories/education_repository.dart';
import '../../domain/repositories/leaderboard_repository.dart';
import '../../domain/repositories/scan_repository.dart';
import '../../domain/repositories/session_repository.dart';
import '../../domain/repositories/user_repository.dart';
import 'auth_repository_impl.dart';
import 'center_repository_impl.dart';
import 'education_repository_impl.dart';
import 'leaderboard_repository_impl.dart';
import 'scan_repository_impl.dart';
import 'session_repository_impl.dart';
import 'user_repository_impl.dart';

final sessionRepositoryProvider = Provider<SessionRepository>(
  (ref) => SessionRepositoryImpl(ref.watch(secureStorageProvider)),
);

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepositoryImpl(ref.watch(dioProvider)),
);

final userRepositoryProvider = Provider<UserRepository>(
  (ref) => UserRepositoryImpl(ref.watch(dioProvider)),
);

final leaderboardRepositoryProvider = Provider<LeaderboardRepository>(
  (ref) => LeaderboardRepositoryImpl(ref.watch(dioProvider)),
);

final scanRepositoryProvider = Provider<ScanRepository>(
  (ref) => ScanRepositoryImpl(ref.watch(dioProvider)),
);

final centerRepositoryProvider = Provider<CenterRepository>(
  (ref) => CenterRepositoryImpl(ref.watch(dioProvider)),
);

final educationRepositoryProvider = Provider<EducationRepository>(
  (ref) => EducationRepositoryImpl(ref.watch(dioProvider)),
);

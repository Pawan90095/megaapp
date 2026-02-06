import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../features/profile/data/profile_repository.dart';
import '../features/profile/presentation/bloc/profile_bloc.dart';
import '../core/analytics_service.dart';
import '../features/dashboard/data/dashboard_repository.dart';
import '../features/dashboard/presentation/bloc/dashboard_bloc.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  sl.registerLazySingleton(() => Dio());

  // Analytics
  sl.registerLazySingleton<AnalyticsService>(() => LoggingAnalyticsService());

  // Profile
  sl.registerLazySingleton(() => ProfileRepository(sl(), sl()));
  sl.registerFactory(() => ProfileBloc(sl()));

  // Dashboard
  sl.registerLazySingleton(() => DashboardRepository(sl(), sl()));
  sl.registerFactory(() => DashboardBloc(sl()));
}

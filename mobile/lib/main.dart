import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/router/app_router.dart';
import 'core/service_locator.dart' as di;
import 'core/theme/app_theme.dart';
import 'features/profile/presentation/bloc/profile_bloc.dart';

import 'features/profile/presentation/bloc/profile_event.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await di.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (_) => di.sl<ProfileBloc>()..add(LoadProfile('testuser')),
        ),
      ],
      child: MaterialApp.router(
        title: 'Professional Identity',
        theme: AppTheme.lightTheme,
        routerConfig: appRouter,
      ),
    );
  }
}

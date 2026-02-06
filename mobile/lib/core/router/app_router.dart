import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../features/profile/presentation/edit_profile_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/edit-profile',
  routes: [
    GoRoute(
      path: '/edit-profile',
      builder: (context, state) => const EditProfileScreen(),
    ),
  ],
);

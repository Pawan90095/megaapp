import 'package:equatable/equatable.dart';
import '../../domain/profile_model.dart';

abstract class ProfileState extends Equatable {
  const ProfileState();
  
  @override
  List<Object?> get props => [];
}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileLoaded extends ProfileState {
  final UserProfile profile;
  final bool isAutoSaved; // To show snackbar without reloading

  const ProfileLoaded(this.profile, {this.isAutoSaved = false});

  @override
  List<Object?> get props => [profile, isAutoSaved];
}

class ProfileError extends ProfileState {
  final String message;
  const ProfileError(this.message);

  @override
  List<Object?> get props => [message];
}

import 'package:equatable/equatable.dart';
import '../../domain/profile_model.dart';

abstract class ProfileEvent extends Equatable {
  const ProfileEvent();

  @override
  List<Object?> get props => [];
}

class LoadProfile extends ProfileEvent {
  final String slug;
  const LoadProfile(this.slug);

  @override
  List<Object?> get props => [slug];
}

class SaveProfile extends ProfileEvent {
  final UserProfile profile;
  const SaveProfile(this.profile);

  @override
  List<Object?> get props => [profile];
}

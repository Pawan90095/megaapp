
import '../../data/profile_repository.dart';
import '../../domain/profile_model.dart';
import 'profile_event.dart';
import 'profile_state.dart';

import 'package:hydrated_bloc/hydrated_bloc.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final ProfileRepository _repository;

  ProfileBloc(this._repository) : super(ProfileInitial()) {
    on<LoadProfile>(_onLoadProfile);
    on<SaveProfile>(_onSaveProfile);
  }

  Future<void> _onLoadProfile(LoadProfile event, Emitter<ProfileState> emit) async {
    // If state is already loaded (from hydration), we might want to refresh silently or just return.
    // But usually we want to fetch fresh data.
    // Let's show loading only if we define it so, or just emit Loading.
    // If we have hydrated state, maybe we should not emit Loading? 
    // For now, standard behavior: Emit Loading, then fetch.
    // Use state checking if we want 'offline first' behavior fully.
    if (state is! ProfileLoaded) {
       emit(ProfileLoading());
    }
    
    try {
      final profile = await _repository.getProfile(event.slug);
      if (profile != null) {
        emit(ProfileLoaded(profile));
      } else {
        if (state is! ProfileLoaded) {
           emit(const ProfileError("User not found"));
        }
      }
    } catch (e) {
      if (state is! ProfileLoaded) {
          emit(ProfileError(e.toString()));
      }
      // If we are loaded, we stay loaded but maybe show a snackbar? 
      // Ideally we emit a side-effect, but for now let's keep it simple.
    }
  }

  Future<void> _onSaveProfile(SaveProfile event, Emitter<ProfileState> emit) async {
    // Optimistic update or Show loading?
    // For auto-save, we usually want subtle or no loading indicator on the whole screen.
    // However, for Simplicity in MVP, we just emit Loading then Loaded.
    
    // Better UX: Keep current state but maybe add a 'saving' flag if we had a complex state object.
    // For now, let's keep it simple: Emitting ProfileLoading might replace the screen content which is bad for auto-save.
    // So we will NOT emit loading, just wait and emit new Loaded.
    
    try {
      final inputProfile = event.profile;
      UserProfile resultingProfile;
      
      if (inputProfile.id != null && inputProfile.id!.isNotEmpty) {
        resultingProfile = await _repository.updateProfile(inputProfile);
      } else {
        resultingProfile = await _repository.createProfile(inputProfile);
      }
      
      emit(ProfileLoaded(resultingProfile, isAutoSaved: true));
    } catch (e) {
      emit(ProfileError("Failed to save: ${e.toString()}"));
    }
  }
}

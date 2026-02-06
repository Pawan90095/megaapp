import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/analytics_stats.dart';
import '../../data/dashboard_repository.dart';

// Events
abstract class DashboardEvent extends Equatable {
  const DashboardEvent();
  @override
  List<Object> get props => [];
}

class LoadDashboardStats extends DashboardEvent {
  final String slug;
  const LoadDashboardStats(this.slug);
}

// States
abstract class DashboardState extends Equatable {
  const DashboardState();
    @override
  List<Object> get props => [];
}

class DashboardInitial extends DashboardState {}
class DashboardLoading extends DashboardState {}
class DashboardLoaded extends DashboardState {
  final AnalyticsStats stats;
  const DashboardLoaded(this.stats);
}
class DashboardError extends DashboardState {
  final String message;
  const DashboardError(this.message);
}

// Bloc
class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  final DashboardRepository repository;

  DashboardBloc(this.repository) : super(DashboardInitial()) {
    on<LoadDashboardStats>((event, emit) async {
      emit(DashboardLoading());
      try {
        final stats = await repository.getStats(event.slug);
        emit(DashboardLoaded(stats));
      } catch (e) {
        emit(const DashboardError("Failed to load stats"));
      }
    });
  }
}

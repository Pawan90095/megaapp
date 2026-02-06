import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../domain/analytics_stats.dart';

class DashboardRepository {
  final Dio _dio;
  final SharedPreferences _prefs;

  DashboardRepository(this._dio, this._prefs);

  Future<AnalyticsStats> getStats(String slug) async {
    try {
      final token = _prefs.getString('auth_token');
      final response = await _dio.get(
        'http://10.0.2.2:3000/api/analytics/$slug', 
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      return AnalyticsStats.fromJson(response.data);
    } catch (e) {
      // Error fetching dashboard stats, return empty stats
      return AnalyticsStats();
    }
  }
}

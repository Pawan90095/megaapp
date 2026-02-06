import 'package:dio/dio.dart';
import '../domain/profile_model.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart';

String get baseUrl {
  // Use the production Vercel URL
  const String productionUrl = 'https://megaapp-walk.vercel.app/api';
  
  if (kIsWeb) return productionUrl;
  return productionUrl;
}

class ProfileRepository {
  final Dio _dio;
  final SharedPreferences _prefs;

  ProfileRepository(this._dio, this._prefs);

  Future<UserProfile?> getProfile(String slug) async {
    try {
      final response = await _dio.get('$baseUrl/users/$slug');
      if (response.statusCode == 200) {
        return UserProfile.fromJson(response.data);
      }
      return null;
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        return null;
      }
      throw Exception('Failed to load profile: ${e.message}');
    }
  }

  Future<UserProfile> createProfile(UserProfile profile) async {
    try {
      final response = await _dio.post(
        '$baseUrl/users',
        data: profile.toJson()..addAll({'password': 'password123'}), // Default password for MVP
      );
      
      final data = response.data;
      if (data['token'] != null) {
        await _prefs.setString('auth_token', data['token']);
      }
      
      return UserProfile.fromJson(data);
    } catch (e) {
      throw Exception('Failed to create profile: $e');
    }
  }

  Future<UserProfile> updateProfile(UserProfile profile) async {
    try {
      final token = _prefs.getString('auth_token');
      final response = await _dio.put(
        '$baseUrl/users/${profile.slug}',
        data: profile.toJson(),
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      return UserProfile.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to update profile: $e');
    }
  }


}

import 'experience_model.dart';
import 'education_model.dart';
import 'skill_model.dart';

class UserProfile {
  final String? id;
  final String slug;
  final String email;
  final String fullName;
  final String? headline;
  final String? bio;
  final String? avatarUrl;
  final String? location;
  final String? website;
  final bool isPublic;
  final Map<String, bool> privacySettings;
  final List<Experience> experience;
  final List<Education> education;
  final List<Skill> skills;

  UserProfile({
    this.id,
    required this.slug,
    required this.email,
    required this.fullName,
    this.headline,
    this.bio,
    this.avatarUrl,
    this.location,
    this.website,
    this.isPublic = true,
    this.privacySettings = const {},
    this.experience = const [],
    this.education = const [],
    this.skills = const [],
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'],
      slug: json['slug'],
      email: json['email'],
      fullName: json['full_name'],
      headline: json['headline'],
      bio: json['bio'],
      avatarUrl: json['avatar_url'],
      location: json['location'],
      website: json['website'],
      isPublic: json['is_public'] ?? true,
      privacySettings: json['privacy_settings'] != null 
          ? Map<String, bool>.from(json['privacy_settings']) 
          : {},
      experience: (json['experience'] as List? ?? [])
          .map((e) => Experience.fromJson(e))
          .toList(),
      education: (json['education'] as List? ?? [])
          .map((e) => Education.fromJson(e))
          .toList(),
      skills: (json['skills'] as List? ?? [])
          .map((e) => Skill.fromJson(e))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'slug': slug,
      'email': email,
      'full_name': fullName,
      'headline': headline,
      'bio': bio,
      'avatar_url': avatarUrl,
      'location': location,
      'website': website,
      'is_public': isPublic,
      'privacy_settings': privacySettings,
      'experience': experience.map((e) => e.toJson()).toList(),
      'education': education.map((e) => e.toJson()).toList(),
      'skills': skills.map((e) => e.toJson()).toList(),
    };
  }
}

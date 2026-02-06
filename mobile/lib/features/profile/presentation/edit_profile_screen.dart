import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:async';
import '../domain/profile_model.dart';
import 'bloc/profile_bloc.dart';
import 'bloc/profile_event.dart';
import 'bloc/profile_state.dart';
import '../domain/experience_model.dart';
import '../domain/education_model.dart';
import '../domain/skill_model.dart';
import 'qr_screen.dart';
import '../../../../core/service_locator.dart';
import '../../../../core/analytics_service.dart';
import 'widgets/profile_skeleton.dart';
import '../../dashboard/presentation/dashboard_screen.dart';
import '../../dashboard/presentation/bloc/dashboard_bloc.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  
  // Controllers
  late TextEditingController _nameController;
  late TextEditingController _headlineController;
  late TextEditingController _bioController;
  
  // Auto-save timer
  Timer? _debounce;

  // Lists
  List<Experience> _experience = [];
  List<Education> _education = [];
  List<Skill> _skills = [];
  Map<String, bool> _privacySettings = {};

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _headlineController = TextEditingController();
    _bioController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _headlineController.dispose();
    _bioController.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  void _onFieldChanged() {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(seconds: 2), () {
      _saveProfile();
    });
  }

  void _saveProfile() {
    // Current State access might need adjustment depending on how we want to get "current profile ID"
    // Since BLoC is event driven, we might need the previous loaded profile to get the ID.
    // For simplicity, we can trust the BLoC's state if we accessed it or just send what we have.
    final state = context.read<ProfileBloc>().state;
    String? currentId;
    String currentSlug = 'testuser';
    String currentEmail = 'test@example.com';

    if (state is ProfileLoaded) {
      currentId = state.profile.id;
      currentSlug = state.profile.slug;
      currentEmail = state.profile.email;
    }

    final newProfile = UserProfile(
      id: currentId,
      slug: currentSlug,
      email: currentEmail,
      fullName: _nameController.text,
      headline: _headlineController.text,
      bio: _bioController.text,
      experience: _experience,
      education: _education,
      skills: _skills,
      privacySettings: _privacySettings,
    );

    context.read<ProfileBloc>().add(SaveProfile(newProfile));
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ProfileBloc, ProfileState>(
      listener: (context, state) {
        if (state is ProfileLoaded && state.isAutoSaved) {
           ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Profile Auto-saved'), duration: Duration(milliseconds: 500)),
          );
        }
        if (state is ProfileLoaded) {
           // Populate fields if they are empty (Initial load)
           if (_nameController.text.isEmpty && state.profile.fullName.isNotEmpty) {
             _nameController.text = state.profile.fullName;
           }
           if (_headlineController.text.isEmpty) {
             _headlineController.text = state.profile.headline ?? '';
           }
           if (_bioController.text.isEmpty) {
             _bioController.text = state.profile.bio ?? '';
           }
           // Only update lists if they are empty (initial load) or we force it?
           // For now, let's say if we are just loading initially. But standard BlocListener might fire on every save.
           // We want to keep local edits if the user is typing?
           // Actually, since we auto-save, we might want to refresh from source of truth?
           // But updating the list while user edits is bad.
           // Let's only populate if `_experience` is empty and state has items.
           if (_experience.isEmpty && state.profile.experience.isNotEmpty) {
             setState(() {
               _experience = List.from(state.profile.experience);
               _education = List.from(state.profile.education);
               _skills = List.from(state.profile.skills);
                if (_privacySettings.isEmpty) {
                   _privacySettings = Map.from(state.profile.privacySettings);
                }
             });
           }
        }
        if (state is ProfileError) {
           ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message), backgroundColor: Colors.red),
          );
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text('Edit Profile', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
          actions: [
            BlocBuilder<ProfileBloc, ProfileState>(
              builder: (context, state) {
                if (state is ProfileLoading) {
                  return const Padding(
                    padding: EdgeInsets.only(right: 16.0),
                    child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)),
                  );
                }
                return Row( // Wrap buttons in a Row
                  children: [
                    IconButton(
                      icon: const Icon(Icons.share),
                      onPressed: () {
                        final currentState = context.read<ProfileBloc>().state;
                        if (currentState is ProfileLoaded) {
                          HapticFeedback.mediumImpact();
                          sl<AnalyticsService>().capture('qr_code_shared', properties: {
                            'slug': currentState.profile.slug,
                          });
                          
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => QrScreen(
                                slug: currentState.profile.slug,
                                fullName: currentState.profile.fullName,
                              ),
                            ),
                          );
                        }
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.analytics),
                      onPressed: () {
                        final currentState = context.read<ProfileBloc>().state;
                        if (currentState is ProfileLoaded) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => BlocProvider(
                                create: (context) => sl<DashboardBloc>()
                                  ..add(LoadDashboardStats(currentState.profile.slug)),
                                child: const DashboardScreen(),
                              ),
                            ),
                          );
                        }
                      },
                    ),
                  ],
                );
              },
            ),
          ],
        ),
        body: BlocBuilder<ProfileBloc, ProfileState>(
          builder: (context, state) {
            if (state is ProfileLoading && _nameController.text.isEmpty) {
               // Only show skeleton if we have no data yet (initial load)
               return const ProfileSkeleton();
            }
            if (state is ProfileError && state.message == "User not found") {
                return const Center(child: Text("User not found. Start typing to create."));
            }
            
            return SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    const CircleAvatar(
                      radius: 50,
                      child: Icon(Icons.person, size: 50),
                    ),
                    const SizedBox(height: 24),
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Full Name',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                      onChanged: (_) => _onFieldChanged(),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _headlineController,
                      decoration: const InputDecoration(
                        labelText: 'Headline',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.work_outline),
                      ),
                      onChanged: (_) => _onFieldChanged(),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _bioController,
                      decoration: const InputDecoration(
                        labelText: 'Bio',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.description_outlined),
                        alignLabelWithHint: true,
                      ),
                      maxLines: 4,
                      onChanged: (_) => _onFieldChanged(),
                    ),
                    const SizedBox(height: 24),
                    _buildExperienceSection(),
                    const SizedBox(height: 24),
                    _buildEducationSection(),
                    const SizedBox(height: 24),
                    _buildPrivacySection(),
                    const SizedBox(height: 24),
                    _buildSkillsSection(),
                    const SizedBox(height: 48),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildExperienceSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Experience', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
            IconButton(
              icon: const Icon(Icons.add_circle_outline),
              onPressed: () => _showAddExperienceDialog(),
            ),
          ],
        ),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _experience.length,
          itemBuilder: (context, index) {
            final exp = _experience[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                title: Text(exp.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('${exp.company} • ${exp.startDate.year} - ${exp.isCurrent ? "Present" : exp.endDate?.year ?? ""}'),
                trailing: IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    HapticFeedback.mediumImpact();
                    setState(() {
                      _experience.removeAt(index);
                    });
                    _saveProfile();
                  },
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildEducationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Education', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
            IconButton(
              icon: const Icon(Icons.add_circle_outline),
              onPressed: () => _showAddEducationDialog(),
            ),
          ],
        ),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _education.length,
          itemBuilder: (context, index) {
            final edu = _education[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                title: Text(edu.school, style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('${edu.degree} • ${edu.startDate.year} - ${edu.endDate?.year ?? "Present"}'),
                trailing: IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    HapticFeedback.mediumImpact();
                    setState(() {
                      _education.removeAt(index);
                    });
                    _saveProfile();
                  },
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildSkillsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Skills', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
            IconButton(
              icon: const Icon(Icons.add_circle_outline),
              onPressed: () => _showAddSkillDialog(),
            ),
          ],
        ),
        Wrap(
          spacing: 8,
          children: _skills.map((skill) {
            return Chip(
              label: Text(skill.name),
              onDeleted: () {
                HapticFeedback.mediumImpact();
                setState(() {
                  _skills.remove(skill);
                });
                _saveProfile();
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Future<void> _showAddExperienceDialog() async {
    final titleController = TextEditingController();
    final companyController = TextEditingController();
    
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Experience'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleController, decoration: const InputDecoration(labelText: 'Job Title')),
            TextField(controller: companyController, decoration: const InputDecoration(labelText: 'Company')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              if (titleController.text.isNotEmpty && companyController.text.isNotEmpty) {
                HapticFeedback.mediumImpact();
                setState(() {
                  _experience.add(Experience(
                    title: titleController.text,
                    company: companyController.text,
                    startDate: DateTime.now(), // Simplified for MVP
                    isCurrent: true,
                  ));
                });
                _saveProfile();
                Navigator.pop(context);
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  Future<void> _showAddEducationDialog() async {
    final schoolController = TextEditingController();
    final degreeController = TextEditingController();

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Education'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: schoolController, decoration: const InputDecoration(labelText: 'School')),
            TextField(controller: degreeController, decoration: const InputDecoration(labelText: 'Degree')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              if (schoolController.text.isNotEmpty) {
                HapticFeedback.mediumImpact();
                setState(() {
                  _education.add(Education(
                    school: schoolController.text,
                    degree: degreeController.text,
                    startDate: DateTime.now(), // Simplified
                  ));
                });
                _saveProfile();
                Navigator.pop(context);
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  Future<void> _showAddSkillDialog() async {
    final skillController = TextEditingController();

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Skill'),
        content: TextField(controller: skillController, decoration: const InputDecoration(labelText: 'Skill Name')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              if (skillController.text.isNotEmpty) {
                HapticFeedback.mediumImpact();
                setState(() {
                  _skills.add(Skill(name: skillController.text));
                });
                _saveProfile();
                Navigator.pop(context);
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  Widget _buildPrivacySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Privacy Settings', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        SwitchListTile(
          title: const Text('Show Email Publicly'),
          value: _privacySettings['show_email'] ?? true,
          onChanged: (val) {
             setState(() {
               _privacySettings['show_email'] = val;
             });
             _saveProfile();
          },
        ),
        SwitchListTile(
          title: const Text('Show Location'),
          value: _privacySettings['show_location'] ?? true,
          onChanged: (val) {
             setState(() {
               _privacySettings['show_location'] = val;
             });
             _saveProfile();
          },
        ),
      ],
    );
  }
}

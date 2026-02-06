class Skill {
  final String? id;
  final String name;
  final String? category;
  final int proficiency;

  Skill({
    this.id,
    required this.name,
    this.category,
    this.proficiency = 1,
  });

  factory Skill.fromJson(Map<String, dynamic> json) {
    return Skill(
      id: json['id'],
      name: json['name'],
      category: json['category'],
      proficiency: json['proficiency'] ?? 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'category': category,
      'proficiency': proficiency,
    };
  }
}

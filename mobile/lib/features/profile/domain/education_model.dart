class Education {
  final String? id;
  final String school;
  final String degree;
  final String? fieldOfStudy;
  final DateTime startDate;
  final DateTime? endDate;
  final String? description;

  Education({
    this.id,
    required this.school,
    required this.degree,
    this.fieldOfStudy,
    required this.startDate,
    this.endDate,
    this.description,
  });

  factory Education.fromJson(Map<String, dynamic> json) {
    return Education(
      id: json['id'],
      school: json['school'],
      degree: json['degree'],
      fieldOfStudy: json['field_of_study'],
      startDate: DateTime.parse(json['start_date']),
      endDate: json['end_date'] != null ? DateTime.parse(json['end_date']) : null,
      description: json['description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'school': school,
      'degree': degree,
      'field_of_study': fieldOfStudy,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate?.toIso8601String(),
      'description': description,
    };
  }
}

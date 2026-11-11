import 'dart:convert';

class NoteModel {
  final String? id;
  final String title;
  final String content;
  final String category;
  final String priority;
  final bool isPinned;
  final DateTime createdAt;
  final DateTime updatedAt;

  const NoteModel({
    this.id,
    required this.title,
    required this.content,
    this.category = 'Personal',
    this.priority = 'Media',
    this.isPinned = false,
    required this.createdAt,
    required this.updatedAt,
  });

  NoteModel copyWith({
    String? id,
    String? title,
    String? content,
    String? category,
    String? priority,
    bool? isPinned,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return NoteModel(
      id: id ?? this.id,
      title: title ?? this.title,
      content: content ?? this.content,
      category: category ?? this.category,
      priority: priority ?? this.priority,
      isPinned: isPinned ?? this.isPinned,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      if (id != null) 'id': id,
      'title': title,
      'content': content,
      'category': category,
      'priority': priority,
      'isPinned': isPinned,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory NoteModel.fromMap(Map<String, dynamic> map) {
    final now = DateTime.now();
    return NoteModel(
      id: map['id']?.toString(),
      title: map['title']?.toString() ?? '',
      content: map['content']?.toString() ?? '',
      category: map['category']?.toString() ?? 'Personal',
      priority: map['priority']?.toString() ?? 'Media',
      isPinned: map['isPinned'] == true || map['isPinned']?.toString() == 'true',
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt'].toString()) ?? now
          : now,
      updatedAt: map['updatedAt'] != null
          ? DateTime.tryParse(map['updatedAt'].toString()) ?? now
          : now,
    );
  }

  String toJson() => jsonEncode(toMap());

  factory NoteModel.fromJson(String source) =>
      NoteModel.fromMap(jsonDecode(source) as Map<String, dynamic>);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is NoteModel &&
        other.id == id &&
        other.title == title &&
        other.content == content &&
        other.category == category &&
        other.priority == priority &&
        other.isPinned == isPinned &&
        other.createdAt == createdAt &&
        other.updatedAt == updatedAt;
  }

  @override
  int get hashCode {
    return Object.hash(
      id,
      title,
      content,
      category,
      priority,
      isPinned,
      createdAt,
      updatedAt,
    );
  }

  @override
  String toString() {
    return 'NoteModel(id: $id, title: $title, category: $category, priority: $priority, isPinned: $isPinned)';
  }
}

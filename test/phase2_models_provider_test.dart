import 'package:flutter_test/flutter_test.dart';
import 'package:app_dev/core/constants/api_constants.dart';
import 'package:app_dev/core/errors/api_exception.dart';
import 'package:app_dev/models/note_model.dart';
import 'package:app_dev/providers/note_provider.dart';
import 'package:app_dev/services/note_api_service.dart';

class MockNoteApiService extends NoteApiService {
  final List<NoteModel> mockNotes = [
    NoteModel(
      id: '1',
      title: 'Nota 1',
      content: 'Contenido 1',
      category: 'Trabajo',
      priority: 'Alta',
      isPinned: false,
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      updatedAt: DateTime.now().subtract(const Duration(hours: 2)),
    ),
    NoteModel(
      id: '2',
      title: 'Nota 2',
      content: 'Contenido 2',
      category: 'Personal',
      priority: 'Baja',
      isPinned: true,
      createdAt: DateTime.now().subtract(const Duration(hours: 1)),
      updatedAt: DateTime.now().subtract(const Duration(hours: 1)),
    ),
  ];

  @override
  Future<List<NoteModel>> getNotes({String? category, String? search}) async {
    var result = List<NoteModel>.from(mockNotes);
    if (category != null && category.isNotEmpty && category != 'Todas') {
      result = result.where((n) => n.category == category).toList();
    }
    if (search != null && search.isNotEmpty) {
      result = result.where((n) => n.title.contains(search)).toList();
    }
    return result;
  }

  @override
  Future<NoteModel> createNote(NoteModel note) async {
    final created = note.copyWith(id: 'mock-new-id');
    mockNotes.add(created);
    return created;
  }

  @override
  Future<NoteModel> updateNote(String id, NoteModel note) async {
    final index = mockNotes.indexWhere((n) => n.id == id);
    if (index != -1) {
      mockNotes[index] = note;
      return note;
    }
    throw const ApiException('Not found', statusCode: 404);
  }

  @override
  Future<bool> deleteNote(String id) async {
    final before = mockNotes.length;
    mockNotes.removeWhere((n) => n.id == id);
    return mockNotes.length < before;
  }

  @override
  Future<bool> checkHealth() async => true;
}

void main() {
  group('Fase 2: Pruebas unitarias de Modelos y Constantes', () {
    test('ApiConstants define base URL y endpoints requeridos', () {
      expect(ApiConstants.baseUrl, isNotEmpty);
      expect(ApiConstants.notesEndpoint, equals('/notes'));
      expect(ApiConstants.healthEndpoint, equals('/health'));
    });

    test('ApiException incluye mensaje y statusCode', () {
      const exception = ApiException('Error de prueba', statusCode: 400);
      expect(exception.message, 'Error de prueba');
      expect(exception.statusCode, 400);
      expect(exception.toString(), contains('400'));
    });

    test('NoteModel serializa y deserializa correctamente', () {
      final now = DateTime.now();
      final note = NoteModel(
        id: 'uuid-123',
        title: 'Prueba Model',
        content: 'Detalles de la nota',
        category: 'Estudio',
        priority: 'Alta',
        isPinned: true,
        createdAt: now,
        updatedAt: now,
      );

      final map = note.toMap();
      expect(map['id'], 'uuid-123');
      expect(map['title'], 'Prueba Model');
      expect(map['isPinned'], true);

      final fromMap = NoteModel.fromMap(map);
      expect(fromMap.id, note.id);
      expect(fromMap.title, note.title);
      expect(fromMap.isPinned, note.isPinned);

      final jsonStr = note.toJson();
      final fromJson = NoteModel.fromJson(jsonStr);
      expect(fromJson.title, note.title);

      final updated = note.copyWith(title: 'Nuevo Titulo');
      expect(updated.title, 'Nuevo Titulo');
      expect(updated.id, note.id);
    });
  });

  group('Fase 2: Pruebas unitarias de NoteProvider', () {
    late MockNoteApiService mockService;
    late NoteProvider provider;

    setUp(() {
      mockService = MockNoteApiService();
      provider = NoteProvider(apiService: mockService);
    });

    test('fetchNotes carga notas y ordena fijadas primero', () async {
      await provider.fetchNotes();

      expect(provider.isLoading, isFalse);
      expect(provider.notes.length, 2);
      expect(provider.notes.first.isPinned, isTrue);
      expect(provider.isBackendOnline, isTrue);
    });

    test('createNote añade nota a la lista', () async {
      await provider.fetchNotes();
      final countBefore = provider.notes.length;

      final success = await provider.createNote(
        NoteModel(
          title: 'Nueva',
          content: 'Contenido nuevo',
          category: 'Ideas',
          priority: 'Media',
          isPinned: false,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      );

      expect(success, isTrue);
      expect(provider.notes.length, countBefore + 1);
    });

    test('togglePinNote conmuta isPinned', () async {
      await provider.fetchNotes();
      final noteToToggle = provider.notes.firstWhere((n) => !n.isPinned);

      final success = await provider.togglePinNote(noteToToggle);
      expect(success, isTrue);
      expect(provider.notes.firstWhere((n) => n.id == noteToToggle.id).isPinned, isTrue);
    });

    test('deleteNote remueve la nota', () async {
      await provider.fetchNotes();
      final idToDelete = provider.notes.first.id!;

      final success = await provider.deleteNote(idToDelete);
      expect(success, isTrue);
      expect(provider.notes.any((n) => n.id == idToDelete), isFalse);
    });
  });
}

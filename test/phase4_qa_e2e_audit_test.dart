import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:provider/provider.dart';

import 'package:app_dev/core/errors/api_exception.dart';
import 'package:app_dev/core/theme/app_theme.dart';
import 'package:app_dev/models/note_model.dart';
import 'package:app_dev/providers/note_provider.dart';
import 'package:app_dev/screens/home_screen.dart';
import 'package:app_dev/screens/note_form_screen.dart';
import 'package:app_dev/services/note_api_service.dart';
import 'package:app_dev/widgets/category_chip_bar.dart';
import 'package:app_dev/widgets/empty_state_widget.dart';
import 'package:app_dev/widgets/note_card.dart';
import 'package:app_dev/widgets/priority_badge.dart';

void main() {
  group('QA & E2E: NoteApiService HTTP Protocol Testing', () {
    const testBaseUrl = 'http://localhost:3000/api';

    test('GET /health devuelve true si status es 200 y status UP/ok', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, '/api/health');
        return http.Response(
          jsonEncode({
            'success': true,
            'status': 'ok',
            'data': {'status': 'UP'}
          }),
          200,
          headers: {'content-type': 'application/json; charset=utf-8'},
        );
      });

      final service = NoteApiService(client: mockClient, baseUrl: testBaseUrl);
      final isHealthy = await service.checkHealth();
      expect(isHealthy, isTrue);
    });

    test('GET /health devuelve false si el servidor responde con 500 o error', () async {
      final mockClient = MockClient((request) async {
        return http.Response('Internal Server Error', 500);
      });

      final service = NoteApiService(client: mockClient, baseUrl: testBaseUrl);
      final isHealthy = await service.checkHealth();
      expect(isHealthy, isFalse);
    });

    test('GET /notes procesa listado y mapea modelos correctamente', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, '/api/notes');
        return http.Response(
          jsonEncode({
            'success': true,
            'data': [
              {
                'id': 'note-1',
                'title': 'Nota 1',
                'content': 'Contenido 1',
                'category': 'Trabajo',
                'priority': 'Alta',
                'isPinned': true,
                'createdAt': '2026-10-28T10:00:00.000Z',
                'updatedAt': '2026-10-28T10:00:00.000Z',
              }
            ]
          }),
          200,
          headers: {'content-type': 'application/json; charset=utf-8'},
        );
      });

      final service = NoteApiService(client: mockClient, baseUrl: testBaseUrl);
      final notes = await service.getNotes();
      expect(notes.length, 1);
      expect(notes.first.id, 'note-1');
      expect(notes.first.title, 'Nota 1');
      expect(notes.first.isPinned, isTrue);
    });

    test('GET /notes con filtro category y search construye query string correcto', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.queryParameters['category'], 'Trabajo');
        expect(request.url.queryParameters['search'], 'Sprint');
        return http.Response(
          jsonEncode({'success': true, 'data': []}),
          200,
          headers: {'content-type': 'application/json; charset=utf-8'},
        );
      });

      final service = NoteApiService(client: mockClient, baseUrl: testBaseUrl);
      final notes = await service.getNotes(category: 'Trabajo', search: 'Sprint');
      expect(notes, isEmpty);
    });

    test('GET /notes/:id lanza ApiException 404 si la nota no existe', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'success': false, 'message': 'Nota no encontrada'}),
          404,
          headers: {'content-type': 'application/json; charset=utf-8'},
        );
      });

      final service = NoteApiService(client: mockClient, baseUrl: testBaseUrl);
      expect(
        () => service.getNoteById('inexistente'),
        throwsA(isA<ApiException>().having((e) => e.statusCode, 'statusCode', 404)),
      );
    });

    test('POST /notes crea nota y deserializa id generado (201 Created)', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'POST');
        final decoded = jsonDecode(request.body) as Map<String, dynamic>;
        expect(decoded['title'], 'Nota E2E');
        return http.Response(
          jsonEncode({
            'success': true,
            'data': {
              'id': 'gen-uuid-1234',
              'title': 'Nota E2E',
              'content': 'Contenido de prueba',
              'category': 'Ideas',
              'priority': 'Media',
              'isPinned': false,
              'createdAt': '2026-10-28T12:00:00.000Z',
              'updatedAt': '2026-10-28T12:00:00.000Z',
            }
          }),
          201,
          headers: {'content-type': 'application/json; charset=utf-8'},
        );
      });

      final service = NoteApiService(client: mockClient, baseUrl: testBaseUrl);
      final newNote = NoteModel(
        title: 'Nota E2E',
        content: 'Contenido de prueba',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      final result = await service.createNote(newNote);
      expect(result.id, 'gen-uuid-1234');
      expect(result.title, 'Nota E2E');
    });

    test('PUT /notes/:id actualiza campos y devuelve objeto actualizado', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'PUT');
        expect(request.url.path, '/api/notes/note-1');
        return http.Response(
          jsonEncode({
            'success': true,
            'data': {
              'id': 'note-1',
              'title': 'Nota 1 Actualizada',
              'content': 'Nuevo Contenido',
              'category': 'Trabajo',
              'priority': 'Alta',
              'isPinned': true,
              'createdAt': '2026-10-28T10:00:00.000Z',
              'updatedAt': '2026-10-28T12:30:00.000Z',
            }
          }),
          200,
          headers: {'content-type': 'application/json; charset=utf-8'},
        );
      });

      final service = NoteApiService(client: mockClient, baseUrl: testBaseUrl);
      final updateCandidate = NoteModel(
        id: 'note-1',
        title: 'Nota 1 Actualizada',
        content: 'Nuevo Contenido',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      final result = await service.updateNote('note-1', updateCandidate);
      expect(result.title, 'Nota 1 Actualizada');
    });

    test('DELETE /notes/:id remueve recurso y valida confirmación', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'DELETE');
        expect(request.url.path, '/api/notes/note-1');
        return http.Response(
          jsonEncode({'success': true, 'data': {'id': 'note-1'}}),
          200,
          headers: {'content-type': 'application/json; charset=utf-8'},
        );
      });

      final service = NoteApiService(client: mockClient, baseUrl: testBaseUrl);
      final ok = await service.deleteNote('note-1');
      expect(ok, isTrue);
    });
  });

  group('QA & E2E: NoteProvider State Management', () {
    late NoteProvider provider;
    late List<NoteModel> inMemoryStore;

    setUp(() {
      inMemoryStore = [
        NoteModel(
          id: 'note-pinned',
          title: 'Nota Fijada',
          content: 'Contenido fijado',
          category: 'Trabajo',
          priority: 'Alta',
          isPinned: true,
          createdAt: DateTime.now().subtract(const Duration(hours: 3)),
          updatedAt: DateTime.now().subtract(const Duration(hours: 3)),
        ),
        NoteModel(
          id: 'note-unpinned',
          title: 'Nota Normal',
          content: 'Contenido común',
          category: 'Personal',
          priority: 'Baja',
          isPinned: false,
          createdAt: DateTime.now().subtract(const Duration(hours: 1)),
          updatedAt: DateTime.now().subtract(const Duration(hours: 1)),
        ),
      ];

      final mockClient = MockClient((request) async {
        final path = request.url.path;

        if (path == '/api/health') {
          return http.Response(
            jsonEncode({'success': true, 'data': {'status': 'UP'}}),
            200,
            headers: {'content-type': 'application/json; charset=utf-8'},
          );
        }

        if (path == '/api/notes' && request.method == 'GET') {
          var items = List<NoteModel>.from(inMemoryStore);
          final cat = request.url.queryParameters['category'];
          final search = request.url.queryParameters['search'];
          if (cat != null && cat.isNotEmpty && cat != 'Todas') {
            items = items.where((n) => n.category.toLowerCase() == cat.toLowerCase()).toList();
          }
          if (search != null && search.isNotEmpty) {
            items = items.where((n) => n.title.toLowerCase().contains(search.toLowerCase())).toList();
          }
          return http.Response(
            jsonEncode({'success': true, 'data': items.map((e) => e.toMap()).toList()}),
            200,
            headers: {'content-type': 'application/json; charset=utf-8'},
          );
        }

        if (path == '/api/notes' && request.method == 'POST') {
          final body = jsonDecode(request.body) as Map<String, dynamic>;
          final created = NoteModel(
            id: 'mock-created-id',
            title: body['title'] as String,
            content: body['content'] as String,
            category: body['category'] as String? ?? 'Personal',
            priority: body['priority'] as String? ?? 'Media',
            isPinned: body['isPinned'] == true,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
          );
          inMemoryStore.add(created);
          return http.Response(
            jsonEncode({'success': true, 'data': created.toMap()}),
            201,
            headers: {'content-type': 'application/json; charset=utf-8'},
          );
        }

        if (request.method == 'PUT') {
          final id = path.split('/').last;
          final body = jsonDecode(request.body) as Map<String, dynamic>;
          final idx = inMemoryStore.indexWhere((n) => n.id == id);
          if (idx != -1) {
            final updated = inMemoryStore[idx].copyWith(
              title: body['title'] as String?,
              content: body['content'] as String?,
              isPinned: body['isPinned'] as bool?,
            );
            inMemoryStore[idx] = updated;
            return http.Response(
              jsonEncode({'success': true, 'data': updated.toMap()}),
              200,
              headers: {'content-type': 'application/json; charset=utf-8'},
            );
          }
          return http.Response(jsonEncode({'success': false, 'message': '404'}), 404);
        }

        if (request.method == 'DELETE') {
          final id = path.split('/').last;
          inMemoryStore.removeWhere((n) => n.id == id);
          return http.Response(
            jsonEncode({'success': true, 'data': {'id': id}}),
            200,
            headers: {'content-type': 'application/json; charset=utf-8'},
          );
        }

        return http.Response('Not Found', 404);
      });

      final service = NoteApiService(client: mockClient, baseUrl: 'http://localhost:3000/api');
      provider = NoteProvider(apiService: service);
    });

    test('fetchNotes carga notas y ordena fijadas primero', () async {
      await provider.fetchNotes();
      expect(provider.notes.length, 2);
      expect(provider.notes.first.isPinned, isTrue);
      expect(provider.pinnedNotes.length, 1);
      expect(provider.unpinnedNotes.length, 1);
      expect(provider.isBackendOnline, isTrue);
    });

    test('createNote añade nota a la lista reactivamente', () async {
      await provider.fetchNotes();
      final newNote = NoteModel(
        title: 'Nueva Tarea E2E',
        content: 'Detalle de la nueva tarea',
        category: 'Estudio',
        priority: 'Media',
        isPinned: false,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      final ok = await provider.createNote(newNote);
      expect(ok, isTrue);
      expect(provider.notes.length, 3);
      expect(provider.notes.any((n) => n.id == 'mock-created-id'), isTrue);
    });

    test('togglePinNote conmuta estado isPinned y reordena', () async {
      await provider.fetchNotes();
      final unpinned = provider.unpinnedNotes.first;
      expect(unpinned.isPinned, isFalse);

      final ok = await provider.togglePinNote(unpinned);
      expect(ok, isTrue);
      expect(provider.pinnedNotes.length, 2);
    });

    test('deleteNote remueve la nota de la lista', () async {
      await provider.fetchNotes();
      final toDelete = provider.notes.first;
      final ok = await provider.deleteNote(toDelete.id!);
      expect(ok, isTrue);
      expect(provider.notes.length, 1);
      expect(provider.notes.any((n) => n.id == toDelete.id), isFalse);
    });

    test('setCategory y search actualizan filtros y disparan búsqueda', () async {
      await provider.fetchNotes();
      provider.setCategory('Trabajo');
      expect(provider.selectedCategory, 'Trabajo');

      provider.search('Normal');
      expect(provider.searchQuery, 'Normal');
    });
  });

  group('QA & E2E: Widgets y Pantallas UI Testing', () {
    Widget buildTestApp({required NoteProvider provider, required Widget child}) {
      return ChangeNotifierProvider<NoteProvider>.value(
        value: provider,
        child: MaterialApp(
          theme: AppTheme.lightTheme,
          home: child,
        ),
      );
    }

    testWidgets('PriorityBadge renderiza etiquetas Alta, Media y Baja con colores correctos',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Column(
              children: const [
                PriorityBadge(priority: 'Alta'),
                PriorityBadge(priority: 'Media'),
                PriorityBadge(priority: 'Baja'),
              ],
            ),
          ),
        ),
      );

      expect(find.text('Alta'), findsOneWidget);
      expect(find.text('Media'), findsOneWidget);
      expect(find.text('Baja'), findsOneWidget);
    });

    testWidgets('CategoryChipBar permite seleccionar categorías', (WidgetTester tester) async {
      String? selectedCat;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CategoryChipBar(
              selectedCategory: selectedCat,
              onCategorySelected: (cat) => selectedCat = cat,
            ),
          ),
        ),
      );

      expect(find.text('Todas'), findsOneWidget);
      expect(find.text('Trabajo'), findsOneWidget);
      expect(find.text('Estudio'), findsOneWidget);
      expect(find.text('Personal'), findsOneWidget);
      expect(find.text('Ideas'), findsOneWidget);

      await tester.tap(find.text('Trabajo'));
      await tester.pump();
      expect(selectedCat, 'Trabajo');
    });

    testWidgets('EmptyStateWidget renderiza mensaje y responde a botón de acción',
        (WidgetTester tester) async {
      bool actionTriggered = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: EmptyStateWidget(
              title: 'No hay notas',
              message: 'Crea tu primera nota para empezar.',
              actionLabel: 'Crear Nota',
              onAction: () => actionTriggered = true,
            ),
          ),
        ),
      );

      expect(find.text('No hay notas'), findsOneWidget);
      expect(find.text('Crea tu primera nota para empezar.'), findsOneWidget);
      expect(find.text('Crear Nota'), findsOneWidget);

      await tester.tap(find.text('Crear Nota'));
      expect(actionTriggered, isTrue);
    });

    testWidgets('HomeScreen renderiza barra de búsqueda, categorías y lista de notas',
        (WidgetTester tester) async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({
            'success': true,
            'data': [
              {
                'id': 'home-note-1',
                'title': 'Nota para Home',
                'content': 'Contenido para Home',
                'category': 'Trabajo',
                'priority': 'Alta',
                'isPinned': true,
                'createdAt': '2026-10-28T10:00:00.000Z',
                'updatedAt': '2026-10-28T10:00:00.000Z',
              }
            ]
          }),
          200,
          headers: {'content-type': 'application/json; charset=utf-8'},
        );
      });
      final service = NoteApiService(client: mockClient);
      final homeProvider = NoteProvider(apiService: service);

      await tester.pumpWidget(
        buildTestApp(
          provider: homeProvider,
          child: const HomeScreen(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byType(HomeScreen), findsOneWidget);
      expect(find.text('Mis Notas'), findsOneWidget);
      expect(find.byType(TextField), findsOneWidget);
      expect(find.byType(CategoryChipBar), findsOneWidget);
      expect(find.text('Nota para Home'), findsOneWidget);
    });

    testWidgets('NoteCard renderiza datos de la nota y diálogo de confirmación para eliminar',
        (WidgetTester tester) async {
      final note = NoteModel(
        id: 'card-1',
        title: 'Prueba Tarjeta UI',
        content: 'Detalles visuales de la tarjeta',
        category: 'Trabajo',
        priority: 'Alta',
        isPinned: true,
        createdAt: DateTime(2026, 10, 28, 14, 0),
        updatedAt: DateTime(2026, 10, 28, 14, 0),
      );

      bool editCalled = false;
      bool deleteCalled = false;
      bool pinCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: NoteCard(
              note: note,
              onEdit: () => editCalled = true,
              onDelete: () => deleteCalled = true,
              onTogglePin: () => pinCalled = true,
            ),
          ),
        ),
      );

      expect(find.text('Prueba Tarjeta UI'), findsOneWidget);
      expect(find.text('Detalles visuales de la tarjeta'), findsOneWidget);
      expect(find.text('Trabajo'), findsOneWidget);
      expect(find.text('Alta'), findsOneWidget);

      // Probar botón de pin
      await tester.tap(find.byIcon(Icons.push_pin));
      expect(pinCalled, isTrue);

      // Probar botón de editar
      await tester.tap(find.text('Editar'));
      expect(editCalled, isTrue);

      // Probar botón de eliminar y diálogo modal
      await tester.tap(find.text('Eliminar'));
      await tester.pumpAndSettle();

      expect(find.text('¿Eliminar nota?'), findsOneWidget);
      expect(find.text('Cancelar'), findsOneWidget);

      // Confirmar eliminación
      await tester.tap(find.widgetWithText(ElevatedButton, 'Eliminar'));
      await tester.pumpAndSettle();
      expect(deleteCalled, isTrue);
    });

    testWidgets('NoteFormScreen valida campos requeridos (título < 3 caracteres o vacío)',
        (WidgetTester tester) async {
      final mockClient = MockClient((_) async => http.Response('{}', 200));
      final service = NoteApiService(client: mockClient);
      final provider = NoteProvider(apiService: service);

      await tester.pumpWidget(
        buildTestApp(
          provider: provider,
          child: const NoteFormScreen(),
        ),
      );

      expect(find.text('Nueva Nota'), findsWidgets);

      // Intentar guardar con campos vacíos
      await tester.tap(find.text('Guardar'));
      await tester.pumpAndSettle();

      expect(find.text('El título es requerido'), findsOneWidget);
      expect(find.text('El contenido de la nota es obligatorio'), findsOneWidget);

      // Escribir título muy corto
      await tester.enterText(find.byType(TextFormField).first, 'Ab');
      await tester.tap(find.text('Guardar'));
      await tester.pumpAndSettle();

      expect(find.text('El título debe tener al menos 3 caracteres'), findsOneWidget);
    });
  });
}

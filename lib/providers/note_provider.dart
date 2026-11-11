import 'package:flutter/foundation.dart';

import '../core/errors/api_exception.dart';
import '../models/note_model.dart';
import '../services/note_api_service.dart';

class NoteProvider extends ChangeNotifier {
  final NoteApiService _apiService;

  List<NoteModel> _notes = [];
  bool _isLoading = false;
  String? _errorMessage;
  String? _selectedCategory;
  String _searchQuery = '';
  bool _isBackendOnline = false;

  NoteProvider({NoteApiService? apiService})
      : _apiService = apiService ?? NoteApiService();

  List<NoteModel> get notes => List.unmodifiable(_notes);
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String? get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  bool get isBackendOnline => _isBackendOnline;

  List<NoteModel> get pinnedNotes =>
      _notes.where((note) => note.isPinned).toList();

  List<NoteModel> get unpinnedNotes =>
      _notes.where((note) => !note.isPinned).toList();

  Future<void> fetchNotes() async {
    _setLoading(true);
    _errorMessage = null;

    try {
      _notes = await _apiService.getNotes(
        category: _selectedCategory,
        search: _searchQuery,
      );
      _sortNotes();
      _isBackendOnline = true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _isBackendOnline = false;
    } catch (e) {
      _errorMessage = 'Error inesperado: $e';
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> createNote(NoteModel note) async {
    _setLoading(true);
    _errorMessage = null;

    try {
      final createdNote = await _apiService.createNote(note);
      // Actualizar lista local manteniendo orden (fijados primero)
      _notes.insert(0, createdNote);
      _sortNotes();
      _isBackendOnline = true;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Error al crear la nota: $e';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> updateNote(String id, NoteModel note) async {
    _setLoading(true);
    _errorMessage = null;

    try {
      final updatedNote = await _apiService.updateNote(id, note);
      final index = _notes.indexWhere((n) => n.id == id);
      if (index != -1) {
        _notes[index] = updatedNote;
        _sortNotes();
      }
      _isBackendOnline = true;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Error al actualizar la nota: $e';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> deleteNote(String id) async {
    _setLoading(true);
    _errorMessage = null;

    try {
      final success = await _apiService.deleteNote(id);
      if (success) {
        _notes.removeWhere((n) => n.id == id);
      }
      _isBackendOnline = true;
      notifyListeners();
      return success;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Error al eliminar la nota: $e';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> togglePinNote(NoteModel note) async {
    if (note.id == null) return false;
    final updated = note.copyWith(isPinned: !note.isPinned);
    return updateNote(note.id!, updated);
  }

  void setCategory(String? category) {
    if (_selectedCategory == category) return;
    _selectedCategory = (category == null || category == 'Todas') ? null : category;
    fetchNotes();
  }

  void search(String query) {
    if (_searchQuery == query) return;
    _searchQuery = query;
    fetchNotes();
  }

  Future<bool> checkHealth() async {
    final status = await _apiService.checkHealth();
    _isBackendOnline = status;
    notifyListeners();
    return status;
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _sortNotes() {
    // Mantiene notas fijadas primero, luego orden por fecha descendente
    _notes.sort((a, b) {
      if (a.isPinned != b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return b.createdAt.compareTo(a.createdAt);
    });
  }

  @override
  void dispose() {
    _apiService.dispose();
    super.dispose();
  }
}

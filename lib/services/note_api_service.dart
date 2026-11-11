import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

import '../core/constants/api_constants.dart';
import '../core/errors/api_exception.dart';
import '../models/note_model.dart';

class NoteApiService {
  final http.Client _client;
  final String _baseUrl;

  NoteApiService({
    http.Client? client,
    String? baseUrl,
  })  : _client = client ?? http.Client(),
        _baseUrl = baseUrl ?? ApiConstants.baseUrl;

  static const Map<String, String> _headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  Future<List<NoteModel>> getNotes({String? category, String? search}) async {
    try {
      final queryParameters = <String, String>{};
      if (category != null && category.trim().isNotEmpty && category != 'Todas') {
        queryParameters['category'] = category.trim();
      }
      if (search != null && search.trim().isNotEmpty) {
        queryParameters['search'] = search.trim();
      }

      final uri = Uri.parse('$_baseUrl${ApiConstants.notesEndpoint}').replace(
        queryParameters: queryParameters.isNotEmpty ? queryParameters : null,
      );

      final response = await _client
          .get(uri, headers: _headers)
          .timeout(ApiConstants.timeout);

      final Map<String, dynamic> body = _decodeResponse(response);

      if (response.statusCode == 200 && body['data'] is List) {
        final list = body['data'] as List<dynamic>;
        return list
            .map((item) => NoteModel.fromMap(item as Map<String, dynamic>))
            .toList();
      } else {
        throw ApiException(
          body['message']?.toString() ?? 'Error al obtener la lista de notas',
          statusCode: response.statusCode,
        );
      }
    } on SocketException catch (e) {
      throw ApiException('No se pudo conectar con el servidor backend (${e.message})');
    } on TimeoutException {
      throw const ApiException('Tiempo de espera agotado al conectar con el servidor');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Error inesperado al obtener notas: $e');
    }
  }

  Future<NoteModel> getNoteById(String id) async {
    try {
      final uri = Uri.parse('$_baseUrl${ApiConstants.notesEndpoint}/$id');
      final response = await _client
          .get(uri, headers: _headers)
          .timeout(ApiConstants.timeout);

      final Map<String, dynamic> body = _decodeResponse(response);

      if (response.statusCode == 200 && body['data'] is Map<String, dynamic>) {
        return NoteModel.fromMap(body['data'] as Map<String, dynamic>);
      } else {
        throw ApiException(
          body['message']?.toString() ?? 'Nota no encontrada',
          statusCode: response.statusCode,
        );
      }
    } on SocketException catch (e) {
      throw ApiException('Error de conexión al buscar la nota (${e.message})');
    } on TimeoutException {
      throw const ApiException('Tiempo de espera agotado al buscar la nota');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Error inesperado al buscar la nota: $e');
    }
  }

  Future<NoteModel> createNote(NoteModel note) async {
    try {
      final uri = Uri.parse('$_baseUrl${ApiConstants.notesEndpoint}');
      final response = await _client
          .post(
            uri,
            headers: _headers,
            body: jsonEncode({
              'title': note.title,
              'content': note.content,
              'category': note.category,
              'priority': note.priority,
              'isPinned': note.isPinned,
            }),
          )
          .timeout(ApiConstants.timeout);

      final Map<String, dynamic> body = _decodeResponse(response);

      if (response.statusCode == 201 && body['data'] is Map<String, dynamic>) {
        return NoteModel.fromMap(body['data'] as Map<String, dynamic>);
      } else {
        throw ApiException(
          body['message']?.toString() ?? 'Error al crear la nota',
          statusCode: response.statusCode,
        );
      }
    } on SocketException catch (e) {
      throw ApiException('Error de conexión al crear la nota (${e.message})');
    } on TimeoutException {
      throw const ApiException('Tiempo de espera agotado al crear la nota');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Error inesperado al crear la nota: $e');
    }
  }

  Future<NoteModel> updateNote(String id, NoteModel note) async {
    try {
      final uri = Uri.parse('$_baseUrl${ApiConstants.notesEndpoint}/$id');
      final response = await _client
          .put(
            uri,
            headers: _headers,
            body: jsonEncode({
              'title': note.title,
              'content': note.content,
              'category': note.category,
              'priority': note.priority,
              'isPinned': note.isPinned,
            }),
          )
          .timeout(ApiConstants.timeout);

      final Map<String, dynamic> body = _decodeResponse(response);

      if (response.statusCode == 200 && body['data'] is Map<String, dynamic>) {
        return NoteModel.fromMap(body['data'] as Map<String, dynamic>);
      } else {
        throw ApiException(
          body['message']?.toString() ?? 'Error al actualizar la nota',
          statusCode: response.statusCode,
        );
      }
    } on SocketException catch (e) {
      throw ApiException('Error de conexión al actualizar la nota (${e.message})');
    } on TimeoutException {
      throw const ApiException('Tiempo de espera agotado al actualizar la nota');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Error inesperado al actualizar la nota: $e');
    }
  }

  Future<bool> deleteNote(String id) async {
    try {
      final uri = Uri.parse('$_baseUrl${ApiConstants.notesEndpoint}/$id');
      final response = await _client
          .delete(uri, headers: _headers)
          .timeout(ApiConstants.timeout);

      final Map<String, dynamic> body = _decodeResponse(response);

      if (response.statusCode == 200) {
        return body['success'] == true;
      } else {
        throw ApiException(
          body['message']?.toString() ?? 'Error al eliminar la nota',
          statusCode: response.statusCode,
        );
      }
    } on SocketException catch (e) {
      throw ApiException('Error de conexión al eliminar la nota (${e.message})');
    } on TimeoutException {
      throw const ApiException('Tiempo de espera agotado al eliminar la nota');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Error inesperado al eliminar la nota: $e');
    }
  }

  Future<bool> checkHealth() async {
    try {
      final uri = Uri.parse('$_baseUrl${ApiConstants.healthEndpoint}');
      final response = await _client
          .get(uri, headers: _headers)
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final body = _decodeResponse(response);
        return body['success'] == true || body['data']?['status'] == 'UP';
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  Map<String, dynamic> _decodeResponse(http.Response response) {
    try {
      return jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    } catch (_) {
      return {'success': false, 'message': response.body};
    }
  }

  void dispose() {
    _client.close();
  }
}

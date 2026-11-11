import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConstants {
  ApiConstants._();

  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000/api';
    }
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:3000/api';
      }
    } catch (_) {
      // En caso de entorno sin soporte para dart:io Platform
      return 'http://localhost:3000/api';
    }
    return 'http://localhost:3000/api';
  }

  static const String notesEndpoint = '/notes';
  static const String healthEndpoint = '/health';

  static const Duration timeout = Duration(seconds: 10);
}

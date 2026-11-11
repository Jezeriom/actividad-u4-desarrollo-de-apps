import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primarios y fondos
  static const Color primary = Color(0xFF4F46E5); // Indigo vibrante
  static const Color primaryDark = Color(0xFF312E81); // Slate Indigo profundo
  static const Color primaryLight = Color(0xFFEEF2FF);
  
  static const Color accent = Color(0xFF06B6D4); // Cyan moderno
  static const Color accentEmerald = Color(0xFF10B981); // Esmeralda

  static const Color background = Color(0xFFF8FAFC); // Slate 50
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF1F5F9); // Slate 100
  static const Color border = Color(0xFFE2E8F0); // Slate 200

  // Textos
  static const Color textPrimary = Color(0xFF0F172A); // Slate 900
  static const Color textSecondary = Color(0xFF64748B); // Slate 500
  static const Color textMuted = Color(0xFF94A3B8); // Slate 400

  // Prioridades
  static const Color priorityHigh = Color(0xFFEF4444); // Coral / Rojo
  static const Color priorityHighBg = Color(0xFFFEE2E2);

  static const Color priorityMedium = Color(0xFFF59E0B); // Ámbar
  static const Color priorityMediumBg = Color(0xFFFEF3C7);

  static const Color priorityLow = Color(0xFF10B981); // Menta / Verde
  static const Color priorityLowBg = Color(0xFFD1FAE5);

  // Categorías
  static const Color categoryTrabajo = Color(0xFF3B82F6);
  static const Color categoryEstudio = Color(0xFF8B5CF6);
  static const Color categoryPersonal = Color(0xFF10B981);
  static const Color categoryIdeas = Color(0xFFF59E0B);

  // Estados
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color pinActive = Color(0xFFF59E0B);
}

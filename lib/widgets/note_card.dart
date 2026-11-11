import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/theme/app_colors.dart';
import '../models/note_model.dart';
import 'priority_badge.dart';

class NoteCard extends StatelessWidget {
  final NoteModel note;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final VoidCallback onTogglePin;

  const NoteCard({
    super.key,
    required this.note,
    required this.onEdit,
    required this.onDelete,
    required this.onTogglePin,
  });

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd MMM, yyyy • HH:mm');
    final formattedDate = dateFormat.format(note.updatedAt);
    final categoryColor = _getCategoryColor(note.category);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: note.isPinned ? AppColors.pinActive.withValues(alpha: 0.6) : AppColors.border,
          width: note.isPinned ? 1.4 : 0.8,
        ),
        boxShadow: [
          BoxShadow(
            color: note.isPinned
                ? AppColors.pinActive.withValues(alpha: 0.08)
                : AppColors.primaryDark.withValues(alpha: 0.05),
            blurRadius: note.isPinned ? 10 : 6,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onEdit,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Fila superior: Categoría, Prioridad y Botón Pin
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: categoryColor.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            _getCategoryIcon(note.category),
                            size: 13,
                            color: categoryColor,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            note.category,
                            style: TextStyle(
                              color: categoryColor,
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    PriorityBadge(priority: note.priority, compact: true),
                    const Spacer(),
                    IconButton(
                      icon: Icon(
                        note.isPinned ? Icons.push_pin : Icons.push_pin_outlined,
                        color: note.isPinned ? AppColors.pinActive : AppColors.textMuted,
                        size: 20,
                      ),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      tooltip: note.isPinned ? 'Desfijar' : 'Fijar nota',
                      onPressed: onTogglePin,
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Título
                Text(
                  note.title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                    letterSpacing: -0.3,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),

                // Contenido
                Text(
                  note.content,
                  style: const TextStyle(
                    fontSize: 13.5,
                    color: AppColors.textSecondary,
                    height: 1.4,
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 14),

                // Fila inferior: Fecha y Acciones (Editar y Eliminar)
                Row(
                  children: [
                    Icon(Icons.access_time_rounded, size: 13, color: AppColors.textMuted),
                    const SizedBox(width: 4),
                    Text(
                      formattedDate,
                      style: const TextStyle(
                        fontSize: 11.5,
                        color: AppColors.textMuted,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const Spacer(),
                    InkWell(
                      onTap: onEdit,
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        child: Row(
                          children: const [
                            Icon(Icons.edit_outlined, size: 15, color: AppColors.primary),
                            SizedBox(width: 4),
                            Text(
                              'Editar',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    InkWell(
                      onTap: () => _showDeleteDialog(context),
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        child: Row(
                          children: const [
                            Icon(Icons.delete_outline_rounded, size: 15, color: AppColors.error),
                            SizedBox(width: 4),
                            Text(
                              'Eliminar',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.error,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Row(
          children: const [
            Icon(Icons.warning_amber_rounded, color: AppColors.error),
            SizedBox(width: 8),
            Text('¿Eliminar nota?'),
          ],
        ),
        content: Text(
          'Esta acción eliminará permanentemente "${note.title}". ¿Deseas continuar?',
          style: const TextStyle(color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogCtx).pop(),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.of(dialogCtx).pop();
              onDelete();
            },
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
  }

  Color _getCategoryColor(String cat) {
    switch (cat.toLowerCase()) {
      case 'trabajo':
        return AppColors.categoryTrabajo;
      case 'estudio':
        return AppColors.categoryEstudio;
      case 'ideas':
        return AppColors.categoryIdeas;
      default:
        return AppColors.categoryPersonal;
    }
  }

  IconData _getCategoryIcon(String cat) {
    switch (cat.toLowerCase()) {
      case 'trabajo':
        return Icons.work_rounded;
      case 'estudio':
        return Icons.menu_book_rounded;
      case 'ideas':
        return Icons.lightbulb_rounded;
      default:
        return Icons.person_rounded;
    }
  }
}

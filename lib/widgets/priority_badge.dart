import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

class PriorityBadge extends StatelessWidget {
  final String priority;
  final bool compact;

  const PriorityBadge({
    super.key,
    required this.priority,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    final color = _getColor(priority);
    final bgColor = _getBgColor(priority);
    final icon = _getIcon(priority);

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 8 : 10,
        vertical: compact ? 3 : 5,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.35), width: 0.8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: compact ? 12 : 14, color: color),
          const SizedBox(width: 4),
          Text(
            priority,
            style: TextStyle(
              color: color,
              fontSize: compact ? 11 : 12,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }

  Color _getColor(String p) {
    switch (p.toLowerCase()) {
      case 'alta':
        return AppColors.priorityHigh;
      case 'media':
        return AppColors.priorityMedium;
      case 'baja':
        return AppColors.priorityLow;
      default:
        return AppColors.textSecondary;
    }
  }

  Color _getBgColor(String p) {
    switch (p.toLowerCase()) {
      case 'alta':
        return AppColors.priorityHighBg;
      case 'media':
        return AppColors.priorityMediumBg;
      case 'baja':
        return AppColors.priorityLowBg;
      default:
        return AppColors.surfaceVariant;
    }
  }

  IconData _getIcon(String p) {
    switch (p.toLowerCase()) {
      case 'alta':
        return Icons.arrow_upward_rounded;
      case 'media':
        return Icons.remove_rounded;
      case 'baja':
        return Icons.arrow_downward_rounded;
      default:
        return Icons.circle;
    }
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/theme/app_colors.dart';
import '../models/note_model.dart';
import '../providers/note_provider.dart';
import '../widgets/category_chip_bar.dart';
import '../widgets/empty_state_widget.dart';
import '../widgets/note_card.dart';
import 'note_form_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = context.read<NoteProvider>();
      provider.checkHealth();
      provider.fetchNotes();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _openForm([NoteModel? note]) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => NoteFormScreen(note: note),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<NoteProvider>();

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            await provider.checkHealth();
            await provider.fetchNotes();
          },
          child: CustomScrollView(
            slivers: [
              // Header Superior
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Mis Notas',
                              style: TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textPrimary,
                                letterSpacing: -0.8,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Organiza tus ideas y tareas en tiempo real',
                              style: TextStyle(
                                fontSize: 13,
                                color: AppColors.textSecondary,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Indicador de estado del Backend
                      _buildApiStatusBadge(provider.isBackendOnline),
                    ],
                  ),
                ),
              ),

              // Barra de búsqueda reactiva
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (val) => provider.search(val),
                    decoration: InputDecoration(
                      hintText: 'Buscar notas por título o contenido...',
                      prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textSecondary),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.close_rounded, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                provider.search('');
                              },
                            )
                          : null,
                    ),
                  ),
                ),
              ),

              // Selector horizontal de categorías
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.only(top: 8, bottom: 12),
                  child: CategoryChipBar(
                    selectedCategory: provider.selectedCategory,
                    onCategorySelected: (cat) => provider.setCategory(cat),
                  ),
                ),
              ),

              // Banner de error si existe
              if (provider.errorMessage != null)
                SliverToBoxAdapter(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.priorityHighBg,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline_rounded, color: AppColors.error),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            provider.errorMessage!,
                            style: const TextStyle(
                              color: AppColors.error,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        TextButton(
                          onPressed: () => provider.fetchNotes(),
                          child: const Text('Reintentar'),
                        ),
                      ],
                    ),
                  ),
                ),

              // Contenido: Indicador de carga, lista o estado vacío
              if (provider.isLoading && provider.notes.isEmpty)
                const SliverFillRemaining(
                  hasScrollBody: false,
                  child: Center(
                    child: CircularProgressIndicator(color: AppColors.primary),
                  ),
                )
              else if (provider.notes.isEmpty)
                SliverFillRemaining(
                  hasScrollBody: false,
                  child: EmptyStateWidget(
                    title: provider.searchQuery.isNotEmpty
                        ? 'Sin resultados para "${provider.searchQuery}"'
                        : 'No hay notas en esta categoría',
                    message: provider.searchQuery.isNotEmpty
                        ? 'Intenta con otro término o limpia la búsqueda.'
                        : 'Comienza creando una nueva nota con el botón inferior.',
                    actionLabel: 'Crear Nota',
                    onAction: () => _openForm(),
                  ),
                )
              else
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final note = provider.notes[index];
                      return NoteCard(
                        note: note,
                        onEdit: () => _openForm(note),
                        onDelete: () async {
                          if (note.id == null) return;
                          final success = await provider.deleteNote(note.id!);
                          if (context.mounted && success) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Nota eliminada correctamente'),
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                          }
                        },
                        onTogglePin: () => provider.togglePinNote(note),
                      );
                    },
                    childCount: provider.notes.length,
                  ),
                ),

              const SliverToBoxAdapter(
                child: SizedBox(height: 80),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openForm(),
        icon: const Icon(Icons.add_rounded),
        label: const Text(
          'Nueva Nota',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }

  Widget _buildApiStatusBadge(bool isOnline) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: isOnline ? AppColors.priorityLowBg : AppColors.priorityHighBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: (isOnline ? AppColors.success : AppColors.error).withValues(alpha: 0.4),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isOnline ? AppColors.success : AppColors.error,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            isOnline ? 'API Conectada' : 'API Desconectada',
            style: TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w600,
              color: isOnline ? AppColors.success : AppColors.error,
            ),
          ),
        ],
      ),
    );
  }
}

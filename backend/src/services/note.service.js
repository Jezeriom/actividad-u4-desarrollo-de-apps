const { v4: uuidv4 } = require('uuid');

const VALID_CATEGORIES = ['Trabajo', 'Estudio', 'Personal', 'Ideas'];
const VALID_PRIORITIES = ['Baja', 'Media', 'Alta'];

class NoteService {
  constructor() {
    this.notes = [
      {
        id: uuidv4(),
        title: 'Planificar arquitectura Flutter',
        content: 'Definir la estructura de carpetas, modelos, proveedores de estado y tema visual en Flutter.',
        category: 'Trabajo',
        priority: 'Alta',
        isPinned: true,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: uuidv4(),
        title: 'Estudiar integración de APIs REST',
        content: 'Repasar buenas prácticas con el paquete http en Dart y manejo seguro de excepciones de red.',
        category: 'Estudio',
        priority: 'Media',
        isPinned: false,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: uuidv4(),
        title: 'Ideas para interfaz Fancy UX',
        content: 'Agregar micro-interacciones, animaciones suaves al filtrar y paleta de colores moderna con modo oscuro.',
        category: 'Ideas',
        priority: 'Baja',
        isPinned: false,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ];
  }

  getAll(filters = {}) {
    let result = [...this.notes];

    if (filters.category && filters.category.toLowerCase() !== 'todas' && filters.category.toLowerCase() !== 'all') {
      result = result.filter(n => n.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.priority) {
      result = result.filter(n => n.priority.toLowerCase() === filters.priority.toLowerCase());
    }

    if (filters.isPinned !== undefined) {
      const pinnedBool = String(filters.isPinned).toLowerCase() === 'true';
      result = result.filter(n => n.isPinned === pinnedBool);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase().trim();
      result = result.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term)
      );
    }

    // Ordenar: notas fijadas primero, luego por fecha de creación descendente
    return result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  getById(id) {
    const note = this.notes.find(n => n.id === id);
    return note || null;
  }

  create(noteData) {
    const now = new Date().toISOString();
    const newNote = {
      id: uuidv4(),
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      category: VALID_CATEGORIES.includes(noteData.category) ? noteData.category : 'Personal',
      priority: VALID_PRIORITIES.includes(noteData.priority) ? noteData.priority : 'Media',
      isPinned: Boolean(noteData.isPinned),
      createdAt: now,
      updatedAt: now
    };

    this.notes.unshift(newNote);
    return newNote;
  }

  update(id, noteData) {
    const index = this.notes.findIndex(n => n.id === id);
    if (index === -1) {
      return null;
    }

    const current = this.notes[index];
    const updatedNote = {
      ...current,
      title: noteData.title !== undefined ? noteData.title.trim() : current.title,
      content: noteData.content !== undefined ? noteData.content.trim() : current.content,
      category: noteData.category && VALID_CATEGORIES.includes(noteData.category)
        ? noteData.category
        : current.category,
      priority: noteData.priority && VALID_PRIORITIES.includes(noteData.priority)
        ? noteData.priority
        : current.priority,
      isPinned: noteData.isPinned !== undefined ? Boolean(noteData.isPinned) : current.isPinned,
      updatedAt: new Date().toISOString()
    };

    this.notes[index] = updatedNote;
    return updatedNote;
  }

  delete(id) {
    const index = this.notes.findIndex(n => n.id === id);
    if (index === -1) {
      return false;
    }
    this.notes.splice(index, 1);
    return true;
  }
}

module.exports = new NoteService();

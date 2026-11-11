const noteService = require('../services/note.service');

class NoteController {
  getAll(req, res, next) {
    try {
      const { category, priority, isPinned, search } = req.query;
      const notes = noteService.getAll({ category, priority, isPinned, search });

      return res.status(200).json({
        success: true,
        message: 'Notas recuperadas exitosamente',
        data: notes
      });
    } catch (error) {
      return next(error);
    }
  }

  getById(req, res, next) {
    try {
      const { id } = req.params;
      const note = noteService.getById(id);

      if (!note) {
        return res.status(404).json({
          success: false,
          message: `Nota con id '${id}' no encontrada`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Nota encontrada exitosamente',
        data: note
      });
    } catch (error) {
      return next(error);
    }
  }

  create(req, res, next) {
    try {
      const { title, content, category, priority, isPinned } = req.body;

      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'El campo "title" es obligatorio y debe ser una cadena no vacía'
        });
      }

      if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'El campo "content" es obligatorio y debe ser una cadena no vacía'
        });
      }

      const newNote = noteService.create({
        title,
        content,
        category,
        priority,
        isPinned
      });

      return res.status(201).json({
        success: true,
        message: 'Nota creada exitosamente',
        data: newNote
      });
    } catch (error) {
      return next(error);
    }
  }

  update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, category, priority, isPinned } = req.body;

      if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({
          success: false,
          message: 'El campo "title" no puede estar vacío'
        });
      }

      if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
        return res.status(400).json({
          success: false,
          message: 'El campo "content" no puede estar vacío'
        });
      }

      const updated = noteService.update(id, {
        title,
        content,
        category,
        priority,
        isPinned
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Nota con id '${id}' no encontrada para actualizar`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Nota actualizada exitosamente',
        data: updated
      });
    } catch (error) {
      return next(error);
    }
  }

  delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = noteService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Nota con id '${id}' no encontrada para eliminar`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Nota eliminada exitosamente',
        data: { id }
      });
    } catch (error) {
      return next(error);
    }
  }

  healthCheck(req, res) {
    return res.status(200).json({
      success: true,
      status: 'ok',
      message: 'Servicio en línea',
      data: {
        status: 'UP',
        health: 'ok',
        timestamp: new Date().toISOString()
      }
    });
  }
}

module.exports = new NoteController();

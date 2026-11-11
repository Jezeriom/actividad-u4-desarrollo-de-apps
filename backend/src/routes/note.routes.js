const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

// Health check endpoint
router.get('/health', (req, res) => noteController.healthCheck(req, res));

// CRUD de Notas
router.get('/notes', (req, res, next) => noteController.getAll(req, res, next));
router.get('/notes/:id', (req, res, next) => noteController.getById(req, res, next));
router.post('/notes', (req, res, next) => noteController.create(req, res, next));
router.put('/notes/:id', (req, res, next) => noteController.update(req, res, next));
router.delete('/notes/:id', (req, res, next) => noteController.delete(req, res, next));

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high')
  ],
  validate,
  createTask
);

router.get('/', auth, getTasks);

router.get('/:id', auth, getTaskById);

router.put('/:id', auth, updateTask);

router.delete('/:id', auth, deleteTask);

module.exports = router;

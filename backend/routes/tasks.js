const express = require('express');
const prisma = require('../lib/prisma');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Create Task (Admin Only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, status, deadline, assignedToId, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and Project ID are required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        deadline: (deadline && deadline !== '') ? new Date(deadline) : null,
        assignedToId: (assignedToId && assignedToId !== '') ? assignedToId : null,
        projectId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get tasks (Authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const { projectId, assignedToId } = req.query;

    const where = {};
    if (projectId) where.projectId = projectId;
    if (assignedToId) where.assignedToId = assignedToId;

    // If member, only show assigned tasks or tasks in their projects? 
    // For now, let's keep it simple: authenticated users can see tasks based on filters.
    if (req.user.role !== 'ADMIN' && !assignedToId && !projectId) {
        where.assignedToId = req.user.userId;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: { name: true, email: true },
        },
        project: {
          select: { title: true },
        },
      },
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Task (Authenticated)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, deadline, assignedToId } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role-based logic
    if (req.user.role === 'ADMIN') {
      // Admin can update everything
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          status,
          deadline: (deadline && deadline !== '') ? new Date(deadline) : undefined,
          assignedToId: (assignedToId && assignedToId !== '') ? assignedToId : undefined,
        },
      });
      return res.json(updatedTask);
    } else {
      // Member can only update status if assigned to them
      if (task.assignedToId !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied. You can only update your own tasks.' });
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: { status },
      });
      return res.json(updatedTask);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete Task (Admin Only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

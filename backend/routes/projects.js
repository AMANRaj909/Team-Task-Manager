const express = require('express');
const prisma = require('../lib/prisma');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Create Project (Admin Only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        createdById: req.user.userId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all projects (Authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Project (Admin Only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    const project = await prisma.project.update({
      where: { id },
      data: { title, description },
    });

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete Project (Admin Only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add Member to Project (Admin Only)
router.post('/:id/members', auth, isAdmin, async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { userId, role } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: role || 'MEMBER',
      },
    });

    res.status(201).json(member);
  } catch (error) {
    console.error('ADD_MEMBER_ERROR:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
});

// Get all users (Authenticated) - for viewing assignments and adding members
router.get('/users/all', auth, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

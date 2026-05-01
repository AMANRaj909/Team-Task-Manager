const express = require('express');
const prisma = require('../lib/prisma');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';

    const where = isAdmin ? {} : { assignedToId: userId };

    const totalTasks = await prisma.task.count({ where });
    const completedTasks = await prisma.task.count({
      where: { ...where, status: 'COMPLETED' },
    });
    const pendingTasks = await prisma.task.count({
      where: { ...where, status: 'PENDING' },
    });
    const inProgressTasks = await prisma.task.count({
      where: { ...where, status: 'IN_PROGRESS' },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        ...where,
        status: { not: 'COMPLETED' },
        deadline: { lt: new Date() },
      },
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
    });
  } catch (error) {
    console.error('DASHBOARD_ERROR:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
});

module.exports = router;

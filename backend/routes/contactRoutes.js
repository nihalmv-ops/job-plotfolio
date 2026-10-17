import express from 'express';
import { handleContactSubmission } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', handleContactSubmission);

// GET /api/contact - Route verification
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    endpoint: '/api/contact',
    method: 'POST to submit contact messages'
  });
});

export default router;

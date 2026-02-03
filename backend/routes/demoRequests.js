import express from 'express';
import mongoose from 'mongoose';
import DemoRequest from '../models/DemoRequest.js';

const router = express.Router();

/* =========================================================
   CREATE DEMO REQUEST
========================================================= */
router.post('/', async (req, res) => {
  console.log('=== Demo Request Received ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  const dbState = mongoose.connection.readyState;
  console.log('Mongoose connection state:', dbState);
  
  if (dbState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database not ready. Please try again later.',
      dbState
    });
  }

  try {
    const requiredFields = ['name', 'email', 'phone', 'company', 'role'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const {
      name,
      email,
      company,
      phone,
      role,
      message,
      interests
    } = req.body;

    const demoRequest = new DemoRequest({
      name,
      email,
      company,
      phone,
      role,
      message: message || '',
      interests: interests || [],
      status: 'new',
      source: 'website',
      metadata: {
        priority: 'medium',
        submittedAt: new Date(),
      },
    });

    await demoRequest.save();

    res.status(201).json({
      success: true,
      message: 'Demo request submitted successfully',
      data: demoRequest,
    });
  } catch (error) {
    console.error('Error saving demo request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save demo request',
      error: error.message,
    });
  }
});

/* =========================================================
   GET ALL DEMO REQUESTS
========================================================= */
router.get('/', async (req, res) => {
  try {
    const requests = await DemoRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching demo requests',
    });
  }
});

/* =========================================================
   GET COUNT OF NEW DEMO REQUESTS
========================================================= */
router.get('/count', async (req, res) => {
  try {
    const count = await DemoRequest.countDocuments({ status: 'new' });
    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Error counting demo requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting demo requests',
    });
  }
});

/* =========================================================
   DELETE DEMO REQUEST (REAL DELETE)
========================================================= */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid demo request ID',
      });
    }

    const deleted = await DemoRequest.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Demo request not found',
      });
    }

    res.json({
      success: true,
      message: 'Demo request deleted successfully',
      data: deleted,
    });
  } catch (error) {
    console.error('Error deleting demo request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete demo request',
    });
  }
});

/* =========================================================
   UPDATE DEMO REQUEST (EDIT)
========================================================= */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid demo request ID',
      });
    }

    const updated = await DemoRequest.findByIdAndUpdate(
      id,
      {
        ...payload,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Demo request not found',
      });
    }

    res.json({
      success: true,
      message: 'Demo request updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating demo request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update demo request',
    });
  }
});

export default router;

import express from 'express';
import { supabase } from '../config/supabase.js';
import { body, param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All purchase routes require authentication
router.use(authenticate);

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/purchases - Get all purchases for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        sweets (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/purchases/:id - Get a single purchase
router.get('/:id', [
  param('id').isUUID(),
  validate
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        sweets (*)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Purchase not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching purchase:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/purchases - Create a new purchase
router.post('/', [
  body('sweet_id').isUUID(),
  body('quantity').isInt({ min: 1 }),
  validate
], async (req, res) => {
  try {
    const userId = req.user.id;

    const { sweet_id, quantity } = req.body;

    // Get the sweet to check availability and price
    const { data: sweet, error: sweetError } = await supabase
      .from('sweets')
      .select('*')
      .eq('id', sweet_id)
      .single();

    if (sweetError) throw sweetError;

    if (!sweet) {
      return res.status(404).json({ success: false, error: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        error: 'Insufficient stock',
        available: sweet.quantity 
      });
    }

    const total_price = sweet.price * quantity;

    // Create purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert([{
        user_id: userId,
        sweet_id,
        quantity,
        total_price
      }])
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    // Update sweet quantity
    const { error: updateError } = await supabase
      .from('sweets')
      .update({ quantity: sweet.quantity - quantity })
      .eq('id', sweet_id);

    if (updateError) throw updateError;

    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

import express from 'express';
import { supabase } from '../config/supabase.js';
import { body, param, query, validationResult } from 'express-validator';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/sweets - Get all sweets with optional filters
router.get('/', [
  query('category').optional().isString(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('search').optional().isString(),
  validate
], async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    
    let queryBuilder = supabase
      .from('sweets')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category', category);
    }
    if (minPrice) {
      queryBuilder = queryBuilder.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      queryBuilder = queryBuilder.lte('price', parseFloat(maxPrice));
    }
    if (search) {
      queryBuilder = queryBuilder.ilike('name', `%${search}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching sweets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/sweets/:id - Get a single sweet by ID
router.get('/:id', [
  param('id').isUUID(),
  validate
], async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('sweets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Sweet not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching sweet:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/sweets - Create a new sweet (Admin only)
router.post('/', authenticate, requireAdmin, [
  body('name').notEmpty().trim(),
  body('price').isNumeric().custom(val => val >= 0),
  body('quantity').isInt({ min: 0 }),
  body('category').notEmpty(),
  body('description').optional().isString(),
  body('image_url').optional().isString(),
  validate
], async (req, res) => {
  try {
    const { name, description, category, price, quantity, image_url } = req.body;

    const { data, error } = await supabase
      .from('sweets')
      .insert([{ name, description, category, price, quantity, image_url }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating sweet:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/sweets/:id - Update a sweet (Admin only)
router.put('/:id', authenticate, requireAdmin, [
  param('id').isUUID(),
  body('name').optional().notEmpty().trim(),
  body('price').optional().isNumeric().custom(val => val >= 0),
  body('quantity').optional().isInt({ min: 0 }),
  body('category').optional().notEmpty(),
  body('description').optional().isString(),
  body('image_url').optional().isString(),
  validate
], async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('sweets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Sweet not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating sweet:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/sweets/:id - Delete a sweet (Admin only)
router.delete('/:id', authenticate, requireAdmin, [
  param('id').isUUID(),
  validate
], async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('sweets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Error deleting sweet:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/sweets/seed - Seed initial sweets data (Admin only)
router.post('/seed', authenticate, requireAdmin, async (req, res) => {
  try {
    const sweetsData = [
      { name: 'Ajmeera Kalakandh', description: 'Traditional milk-based sweet with rich flavor', category: 'sweets', price: 450.00, quantity: 10, image_url: '/sweetsImgs/AjmeeaKalakandh.jpg' },
      { name: 'Ariselu', description: 'Classic rice flour sweet made with jaggery', category: 'sweets', price: 320.00, quantity: 12, image_url: '/sweetsImgs/Ariselu.jpg' },
      { name: 'Badusha', description: 'Deep-fried flaky sweet soaked in sugar syrup', category: 'sweets', price: 280.00, quantity: 15, image_url: '/sweetsImgs/Badusha.jpg' },
      { name: 'Basen Ladoo', description: 'Traditional besan flour ladoo with ghee', category: 'sweets', price: 350.00, quantity: 10, image_url: '/sweetsImgs/BasenLadoo.jpg' },
      { name: 'Brittle Candy', description: 'Crunchy caramelized sugar candy', category: 'snacks', price: 180.00, quantity: 20, image_url: '/sweetsImgs/BrittleCandy.jpg' },
      { name: 'Chakkara Rekulu', description: 'Traditional Andhra sweet rice crackers', category: 'sweets', price: 380.00, quantity: 12, image_url: '/sweetsImgs/ChakkaraRekulu.jpg' },
      { name: 'Coconut Burfi', description: 'Rich coconut fudge with cardamom flavor', category: 'sweets', price: 300.00, quantity: 15, image_url: '/sweetsImgs/cocnutburfi.jpg' },
      { name: 'Coconut Ladoo', description: 'Sweet coconut balls with condensed milk', category: 'sweets', price: 280.00, quantity: 18, image_url: '/sweetsImgs/CocnutLadoo.jpg' },
      { name: 'Community Special', description: 'Assorted premium sweets collection box', category: 'gift_boxes', price: 1200.00, quantity: 5, image_url: '/sweetsImgs/Community.jpg' },
      { name: 'Dryfruit Basen Ladoo', description: 'Premium besan ladoo loaded with dry fruits', category: 'premium_sweets', price: 550.00, quantity: 8, image_url: '/sweetsImgs/DryfruitBasenLadoo.jpg' },
      { name: 'Gaja Halwa', description: 'Rich carrot halwa with nuts and khoya', category: 'sweets', price: 400.00, quantity: 10, image_url: '/sweetsImgs/GajaHalwa.jpg' },
      { name: 'Gond Ke Ladoo', description: 'Nutritious edible gum ladoo with ghee', category: 'premium_sweets', price: 480.00, quantity: 7, image_url: '/sweetsImgs/gond ke Ladoo.jpg' },
      { name: 'Ice Cream Burfi', description: 'Creamy milk burfi with ice cream flavor', category: 'premium_sweets', price: 420.00, quantity: 12, image_url: '/sweetsImgs/IceCreamBurfi.jpg' },
      { name: 'Jalebi', description: 'Crispy spiral-shaped sweet soaked in syrup', category: 'sweets', price: 250.00, quantity: 25, image_url: '/sweetsImgs/Jalebi.jpg' },
      { name: 'Kalakand', description: 'Soft milk cake with cardamom and pistachios', category: 'sweets', price: 380.00, quantity: 10, image_url: '/sweetsImgs/Kalakand.jpg' },
      { name: 'Mawa Malpua', description: 'Traditional fried pancakes with mawa topping', category: 'sweets', price: 350.00, quantity: 15, image_url: '/sweetsImgs/Mawa Malpua.jpg' },
      { name: 'Pure Ghee Sweets', description: 'Assorted sweets made with pure desi ghee', category: 'premium_sweets', price: 600.00, quantity: 8, image_url: '/sweetsImgs/PureGhee.jpg' },
      { name: 'Rasmalai', description: 'Soft cottage cheese dumplings in sweetened milk', category: 'sweets', price: 450.00, quantity: 12, image_url: '/sweetsImgs/Rasmalai.jpg' },
      { name: 'Shahi Tukra', description: 'Royal bread pudding with rabri and nuts', category: 'premium_sweets', price: 380.00, quantity: 10, image_url: '/sweetsImgs/ShahiTukra.jpg' },
      { name: 'Til Patti', description: 'Sesame seed brittle with jaggery', category: 'snacks', price: 200.00, quantity: 20, image_url: '/sweetsImgs/TilPatti.jpg' },
      { name: 'Traditional Sweets Box', description: 'Curated box of traditional Indian sweets', category: 'gift_boxes', price: 1500.00, quantity: 5, image_url: '/sweetsImgs/TraditionalSweets.jpg' }
    ];

    const { data, error } = await supabase
      .from('sweets')
      .upsert(sweetsData, { onConflict: 'name' })
      .select();

    if (error) throw error;

    res.json({ success: true, message: 'Sweets data seeded successfully', count: data.length });
  } catch (error) {
    console.error('Error seeding sweets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

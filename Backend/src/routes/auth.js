import express from 'express';
import { supabase } from '../config/supabase.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/auth/signup - Register a new user
router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').optional().trim(),
  validate
], async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name
        }
      }
    });

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'User created successfully. Please check your email to verify your account.',
      user: data.user 
    });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/auth/signin - Sign in a user
router.post('/signin', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate
], async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({ 
      success: true, 
      user: data.user,
      session: data.session 
    });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(401).json({ success: false, error: error.message });
  }
});

// POST /api/auth/signout - Sign out a user
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    res.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/user - Get current user profile
router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) throw error;

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    res.json({ 
      success: true, 
      user,
      profile 
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(401).json({ success: false, error: error.message });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', [
  body('full_name').optional().trim(),
  body('avatar_url').optional().isURL(),
  validate
], async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const updates = req.body;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

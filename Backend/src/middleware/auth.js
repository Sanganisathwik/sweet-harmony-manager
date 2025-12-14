import { supabase } from '../config/supabase.js';

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token.',
        code: 'INVALID_TOKEN'
      });
    }

    // Attach user info to request object
    req.user = user;
    req.token = token;

    // Fetch user role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    req.userRole = roleData?.role || 'customer';

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed.',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Admin Authorization Middleware
 * Must be used after authenticate middleware
 */
export const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin privileges required.',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (!error && user) {
        req.user = user;
        req.token = token;

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        req.userRole = roleData?.role || 'customer';
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

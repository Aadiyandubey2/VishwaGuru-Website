import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  name: string;
  email: string;
}

// Middleware to authenticate user from JWT token
const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret'
    ) as JwtPayload;
    
    // Attach user to request
    (req as any).user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired'
    });
  }
};

export default auth;
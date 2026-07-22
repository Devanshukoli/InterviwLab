import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthService } from '../api/auth/auth.service';
import { User } from '../db';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Signs a JWT token containing user identity details
 */
export function generateJwtToken(user: User | { id: string; email: string; name: string; role: 'user' | 'admin' }): string {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user'
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d', // Token valid for 7 days
    issuer: 'InterviewOps-Auth'
  });
}

/**
 * Verifies a JWT token signature and payload
 */
export function verifyJwtToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret, { issuer: 'InterviewOps-Auth' }) as JwtPayload;
}

/**
 * Middleware that extracts Bearer JWT token from Request header,
 * verifies it, populates req.user, and sets session in AuthService.
 */
export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || (req.headers['x-access-token'] as string);
  
  if (!authHeader) {
    next();
    return;
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7).trim() 
    : authHeader.trim();

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = verifyJwtToken(token);
    req.user = decoded;

    // Synchronize active session in AuthService
    AuthService.setCurrentUser({
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || 'user',
      passwordHash: '' // Hidden in token payload
    });

    next();
  } catch (err: any) {
    // If token is malformed, expired, or invalid, clear req.user so downstream routes handle appropriately
    req.user = undefined;
    next();
  }
}

/**
 * Middleware that strictly enforces authenticated requests.
 */
export function requireJWT(req: Request, res: Response, next: NextFunction): void {
  if (!req.user && !AuthService.getCurrentUser()) {
    res.status(401).json({ success: false, error: 'Authentication required. Please provide a valid Bearer JWT.' });
    return;
  }
  next();
}

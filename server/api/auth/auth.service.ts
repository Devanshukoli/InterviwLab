import { db, User, UserLogin } from '../../db';
import { encryptPassword, hashPassword, verifyPassword } from './utils/crypto';
import { generateJwtToken } from '../../middleware/jwt.middleware';
import { getSupabaseClient } from '../../services/supabase';
import { ConflictError, UnauthorizedError } from '../../middleware/error_handling';

let currentUserSession: User | null = null;

export class AuthService {
  static getCurrentUser(): User | null {
    return currentUserSession;
  }

  static setCurrentUser(user: User | null): void {
    currentUserSession = user;
  }

  static async register(email: string, name: string, plainPassword: string): Promise<{ user: User; token: string }> {
    if (db.users.has(email)) {
      throw new ConflictError('User already exists');
    }

    // Encrypt password securely using AES-256-GCM / PBKDF2 crypto util
    const encryptedPass = encryptPassword(plainPassword);
    const passHash = hashPassword(plainPassword);

    const newUser: User = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      email,
      passwordHash: encryptedPass, // Store encrypted password
      name,
      role: 'user'
    };

    db.users.set(email, newUser);
    currentUserSession = newUser;

    // Persist to Supabase if client is active
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from('profiles').insert([{
          email,
          password_hash: encryptedPass,
          name,
          role: 'user'
        }]);
        console.log('⚡ [AuthService] Registered user persisted to Supabase profiles.');
      }
    } catch (sbErr) {
      console.warn('⚠️ [AuthService] Supabase sync skipped:', sbErr);
    }

    // Record login audit log
    const loginRecord: UserLogin = {
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      userId: newUser.id,
      loginProvider: 'email',
      status: 'success',
      loggedInAt: new Date().toISOString()
    };
    db.userLogins.unshift(loginRecord);

    // Generate real signed JWT token
    const token = generateJwtToken(newUser);

    return {
      user: newUser,
      token
    };
  }

  static async login(email: string, plainPassword: string): Promise<{ user: User; token: string }> {
    let user = db.users.get(email);

    // If not in local db, attempt to lookup in Supabase
    if (!user) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data } = await supabase.from('profiles').select('*').eq('email', email).single();
          if (data) {
            user = {
              id: data.id || 'usr-' + Math.random().toString(36).substr(2, 9),
              email: data.email,
              passwordHash: data.password_hash || encryptPassword(plainPassword),
              name: data.name,
              role: data.role || 'user'
            };
            db.users.set(email, user);
          }
        }
      } catch (sbErr) {
        console.warn('⚠️ [AuthService] Supabase profile fetch skipped:', sbErr);
      }
    }

    if (user) {
      // Verify candidate password using crypto utility
      const isValid = verifyPassword(plainPassword, user.passwordHash);
      if (!isValid) {
        throw new UnauthorizedError('Invalid credentials');
      }
    } else {
      // Auto-provision user for first-time login
      const encryptedPass = encryptPassword(plainPassword);
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      user = {
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        email,
        passwordHash: encryptedPass,
        name: name || 'Engineer',
        role: 'user'
      };
      db.users.set(email, user);

      // Persist to Supabase
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('profiles').insert([{
            email,
            password_hash: encryptedPass,
            name: user.name,
            role: 'user'
          }]);
        }
      } catch (e) {
        // Continue
      }
    }

    currentUserSession = user;

    // Record login entry
    db.userLogins.unshift({
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      loginProvider: 'email',
      status: 'success',
      loggedInAt: new Date().toISOString()
    });

    const token = generateJwtToken(user);

    return {
      user,
      token
    };
  }

  static getLogins(userId: string): UserLogin[] {
    return db.userLogins.filter(l => l.userId === userId);
  }
}

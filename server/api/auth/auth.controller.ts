import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { BadRequestError, UnauthorizedError, catchAsync } from '../../middleware/error_handling';

export class AuthController {
  static register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      throw new BadRequestError('Missing registration details (email, name, and password required)');
    }
    const data = await AuthService.register(email, name, password);
    res.json({ success: true, data });
  });

  static login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Email and password required');
    }
    const data = await AuthService.login(email, password);
    res.json({ success: true, data });
  });

  static google = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, name } = req.body;
    const userEmail = email || 'devanshu.google@interviewops.io';
    const userName = name || 'Devanshu Koli (Google)';
    const data = await AuthService.googleLogin(userEmail, userName);
    res.json({ success: true, data });
  });

  static me = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = req.user || AuthService.getCurrentUser();
    if (!user) {
      throw new UnauthorizedError('Unauthorized');
    }
    res.json({ success: true, data: user });
  });

  static logins = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = req.user || AuthService.getCurrentUser();
    const userId = user?.id || 'usr-default';
    const data = AuthService.getLogins(userId);
    res.json({ success: true, data });
  });
}

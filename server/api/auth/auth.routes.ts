import { Router } from 'express';
import { AuthController } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.get('/google/url', AuthController.googleUrl);
authRouter.get('/google/callback', AuthController.googleCallback);
authRouter.post('/google', AuthController.google);
authRouter.get('/me', AuthController.me);
authRouter.get('/logins', AuthController.logins);

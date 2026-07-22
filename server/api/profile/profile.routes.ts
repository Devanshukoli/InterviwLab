import { Router } from 'express';
import { ProfileController } from './profile.controller';

export const profileRouter = Router();

profileRouter.get('/', ProfileController.getProfile);
profileRouter.patch('/', ProfileController.updateProfile);

import { Router } from 'express';
import { ProgressController } from './progress.controller';

export const progressRouter = Router();

progressRouter.get('/', ProgressController.getProgress);

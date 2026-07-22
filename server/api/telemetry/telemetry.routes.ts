import { Router } from 'express';
import { TelemetryController } from './telemetry.controller';

export const telemetryRouter = Router();

telemetryRouter.get('/', TelemetryController.getTelemetry);

import { Router } from 'express';
import { authRouter } from './auth/auth.routes';
import { interviewRouter } from './interview/interview.routes';
import { billingRouter } from './billing/billing.routes';
import { historyRouter } from './history/history.routes';
import { progressRouter } from './progress/progress.routes';
import { profileRouter } from './profile/profile.routes';
import { telemetryRouter } from './telemetry/telemetry.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/interview', interviewRouter);
apiRouter.use('/billing', billingRouter);
apiRouter.use('/history', historyRouter);
apiRouter.use('/progress', progressRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/telemetry', telemetryRouter);

// Alias routes for direct legacy endpoint compatibility
apiRouter.use('/', historyRouter); // handles GET /api/resumes, DELETE /api/resumes/:id

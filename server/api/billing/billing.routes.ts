import { Router } from 'express';
import { BillingController } from './billing.controller';

export const billingRouter = Router();

billingRouter.get('/history', BillingController.getHistory);
billingRouter.get('/subscription', BillingController.getSubscription);

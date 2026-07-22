import { db, BillingHistory, UserSubscription } from '../../db';
import { AuthService } from '../auth/auth.service';

export class BillingService {
  static getHistory(): BillingHistory[] {
    const user = AuthService.getCurrentUser();
    const userId = user?.id || 'usr-default';
    return db.billingHistory.filter(b => b.userId === userId);
  }

  static getSubscription(): UserSubscription | null {
    const user = AuthService.getCurrentUser();
    if (!user) return null;
    return db.subscriptions.get(user.id) || null;
  }
}

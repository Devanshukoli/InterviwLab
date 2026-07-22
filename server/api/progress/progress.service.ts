import { db, LearningProgress } from '../../db';
import { AuthService } from '../auth/auth.service';

export class ProgressService {
  static getProgress(): LearningProgress[] {
    const user = AuthService.getCurrentUser();
    const userId = user?.id || 'usr-anonymous';
    return db.progress.get(userId) || [];
  }
}

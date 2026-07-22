import { AuthService } from '../auth/auth.service';

export class ProfileService {
  static getProfile() {
    return AuthService.getCurrentUser();
  }

  static updateProfile(name?: string) {
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('Unauthorized');
    }
    if (name) {
      user.name = name;
    }
    return user;
  }
}

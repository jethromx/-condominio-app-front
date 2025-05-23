import { User } from './user.interface';

export interface AuthResponse {
  //user: User;
  _id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}

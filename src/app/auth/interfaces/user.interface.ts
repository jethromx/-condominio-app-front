export interface User {
  _id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roles: string[];
}

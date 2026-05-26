export interface User {
  id: number;
  username: string;
  role: 'Admin' | 'General User';
  lastLogin: string | null;
}

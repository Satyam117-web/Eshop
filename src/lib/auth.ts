import bcrypt from 'bcryptjs';
import { User } from '@/types';

// Mock users database (replace with real DB in production)
const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

// Mock passwords (in production, store hashed passwords in DB)
const passwords: Record<string, string> = {
  'admin@example.com': bcrypt.hashSync('admin123', 10),
  'user@example.com': bcrypt.hashSync('user123', 10),
};

export async function verifyCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = users.find((u) => u.email === email);
  if (!user) return null;

  const hashedPassword = passwords[email];
  if (!hashedPassword) return null;

  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid ? user : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find((u) => u.email === email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find((u) => u.id === id) || null;
}

export function isAdmin(user: User | null | undefined): boolean {
  return user?.role === 'admin';
}


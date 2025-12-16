import NextAuth, { DefaultSession } from 'next-auth';
import { User as AppUser } from '@/lib/types';

declare module 'next-auth' {
  interface Session {
    user: {
      role: AppUser['role'];
      partnerId?: AppUser['partnerId'];
    } & DefaultSession['user'];
  }
  interface User extends AppUser {}
}
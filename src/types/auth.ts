import { User } from '@supabase/supabase-js';

export type Provider = 'google' | 'github' | 'linkedin';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
}
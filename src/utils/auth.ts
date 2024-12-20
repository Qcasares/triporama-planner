import { supabase } from '@/lib/supabase';
import { Provider } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

export const handleAuthError = (error: any, action: string) => {
  toast({
    title: `Error ${action}`,
    description: error.message,
    variant: "destructive",
  });
  throw error;
};

export const handleAuthSuccess = (message: { title: string; description: string }) => {
  toast(message);
};

export const authUtils = {
  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      handleAuthSuccess({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      handleAuthError(error, "signing in");
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      handleAuthSuccess({
        title: "Welcome!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      handleAuthError(error, "signing up");
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      handleAuthSuccess({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      handleAuthError(error, "signing out");
    }
  },

  signInWithProvider: async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      handleAuthError(error, "signing in");
    }
  },
};
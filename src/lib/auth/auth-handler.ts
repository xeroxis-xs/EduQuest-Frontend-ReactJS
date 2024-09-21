import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

/**
 * Handles authentication errors by triggering the sign-in process.
 */
export const handleAuthError = async (): Promise<void> => {
  try {
    await authClient.signInWithMsal();
  } catch (error) {
    logger.error('Error during authentication handling:', error);
    // Optionally, you can implement further error handling or user notifications here.
  }
};

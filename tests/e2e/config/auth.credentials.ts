/**
 * Authentication Credentials Configuration
 * Centralized credential management for different user roles
 * 
 * OrangeHRM Automation Suite
 */

export type UserKey = 'admin' | 'ess_user' | 'supervisor';

export interface UserCredentials {
  email: string;
  password: string;
  role: string;
}

/**
 * Credentials for different user roles in OrangeHRM
 */
export const credentialsByUser: Record<UserKey, UserCredentials> = {
  admin: {
    email: process.env.STAGING_ADMIN_USERNAME || 'Admin',
    password: process.env.STAGING_ADMIN_PASSWORD || 'admin123',
    role: 'Admin',
  },
  ess_user: {
    email: process.env.ESS_USERNAME || 'Admin',
    password: process.env.ESS_PASSWORD || 'admin123',
    role: 'ESS',
  },
  supervisor: {
    email: process.env.SUPERVISOR_USERNAME || 'Admin',
    password: process.env.SUPERVISOR_PASSWORD || 'admin123',
    role: 'Supervisor',
  },
};

/**
 * Get credentials by user key
 */
export function getCredentialsByUser(userKey: UserKey): UserCredentials {
  const credentials = credentialsByUser[userKey];
  if (!credentials) {
    throw new Error(`No credentials found for user key: ${userKey}`);
  }
  return credentials;
}

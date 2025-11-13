/**
 * Environment configuration for the application
 */

interface EnvironmentConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Get environment configuration with validation
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  
  if (!apiBaseUrl) {
    console.warn('REACT_APP_API_BASE_URL not set, using default localhost:8000');
  }

  return {
    apiBaseUrl: apiBaseUrl || 'http://localhost:8000',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  };
};

// Export the config as a singleton
export const config = getEnvironmentConfig();

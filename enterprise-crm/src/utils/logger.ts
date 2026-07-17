/**
 * Kartezy Enterprise CRM — Logger
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function createLogger(module: string) {
  return {
    debug: (msg: string, data?: Record<string, unknown>) =>
      console.debug(`[${new Date().toISOString()}] [DEBUG] [${module}] ${msg}`, data || ''),
    info: (msg: string, data?: Record<string, unknown>) =>
      console.info(`[${new Date().toISOString()}] [INFO] [${module}] ${msg}`, data || ''),
    warn: (msg: string, data?: Record<string, unknown>) =>
      console.warn(`[${new Date().toISOString()}] [WARN] [${module}] ${msg}`, data || ''),
    error: (msg: string, data?: Record<string, unknown>) =>
      console.error(`[${new Date().toISOString()}] [ERROR] [${module}] ${msg}`, data || ''),
  };
}

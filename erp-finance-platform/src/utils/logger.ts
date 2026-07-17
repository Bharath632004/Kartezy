/**
 * Kartezy Enterprise ERP & Finance Platform — Logger
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  module: string;
  data?: Record<string, unknown>;
}

class ERPLogger {
  private module: string;

  constructor(module: string) {
    this.module = module;
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      module: this.module,
      data,
    };

    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${this.module}]`;
    const suffix = data ? ` ${JSON.stringify(data)}` : '';

    switch (level) {
      case 'error':
        console.error(`${prefix} ${message}${suffix}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}${suffix}`);
        break;
      case 'debug':
        console.debug(`${prefix} ${message}${suffix}`);
        break;
      default:
        console.log(`${prefix} ${message}${suffix}`);
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.log('error', message, data);
  }
}

export function createLogger(module: string): ERPLogger {
  return new ERPLogger(module);
}

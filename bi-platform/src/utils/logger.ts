/**
 * Kartezy Enterprise BI Platform - Logger
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const LOG_LEVELS: Record<string, LogLevel> = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
};

export class BILogger {
  private name: string;
  private level: LogLevel;

  constructor(name: string, level: string = 'info') {
    this.name = name;
    this.level = LOG_LEVELS[level] ?? LogLevel.INFO;
  }

  private format(level: string, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.name}] ${message}${metaStr}`;
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (this.level <= LogLevel.DEBUG) console.debug(this.format('debug', message, meta));
  }

  info(message: string, meta?: Record<string, unknown>): void {
    if (this.level <= LogLevel.INFO) console.info(this.format('info', message, meta));
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    if (this.level <= LogLevel.WARN) console.warn(this.format('warn', message, meta));
  }

  error(message: string, meta?: Record<string, unknown>): void {
    if (this.level <= LogLevel.ERROR) console.error(this.format('error', message, meta));
  }
}

const loggers = new Map<string, BILogger>();

export function createBILogger(name: string): BILogger {
  if (!loggers.has(name)) {
    loggers.set(name, new BILogger(name, process.env.LOG_LEVEL || 'info'));
  }
  return loggers.get(name)!;
}

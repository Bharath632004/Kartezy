export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

const levelNames: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
};

class AILogger {
  private level: LogLevel;
  private context: string;

  constructor(context: string = 'AI-Platform', level?: LogLevel) {
    this.context = context;
    const envLevel = (process.env.LOG_LEVEL || 'info').toUpperCase();
    this.level = level ?? (
      envLevel === 'DEBUG' ? LogLevel.DEBUG :
      envLevel === 'WARN' ? LogLevel.WARN :
      envLevel === 'ERROR' ? LogLevel.ERROR :
      LogLevel.INFO
    );
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${levelNames[level]}] [${this.context}] ${message}${dataStr}`;
  }

  debug(message: string, data?: unknown): void {
    if (this.level <= LogLevel.DEBUG) console.debug(this.formatMessage(LogLevel.DEBUG, message, data));
  }

  info(message: string, data?: unknown): void {
    if (this.level <= LogLevel.INFO) console.info(this.formatMessage(LogLevel.INFO, message, data));
  }

  warn(message: string, data?: unknown): void {
    if (this.level <= LogLevel.WARN) console.warn(this.formatMessage(LogLevel.WARN, message, data));
  }

  error(message: string, data?: unknown): void {
    if (this.level <= LogLevel.ERROR) console.error(this.formatMessage(LogLevel.ERROR, message, data));
  }

  fatal(message: string, data?: unknown): void {
    console.error(this.formatMessage(LogLevel.FATAL, message, data));
  }

  child(context: string): AILogger {
    return new AILogger(`${this.context}:${context}`, this.level);
  }
}

export function createLogger(context?: string): AILogger {
  return new AILogger(context);
}

export default AILogger;

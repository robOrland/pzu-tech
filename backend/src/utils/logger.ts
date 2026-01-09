/**
 * Logger estruturado para o backend
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
  };
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): string {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
      ...(error && {
        error: {
          message: error.message,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
      }),
    };

    return JSON.stringify(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    console.error(this.formatMessage('error', message, context, error));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

export const logger = new Logger();

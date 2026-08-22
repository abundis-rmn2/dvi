interface LoggerOptions {
  debug?: boolean;
}

class Logger {
  private debug: boolean;

  constructor(options: LoggerOptions = {}) {
    this.debug = options.debug ?? process.env.NODE_ENV !== 'production';
  }

  log(component: string, message: string, data?: any) {
    if (this.debug) {
      console.log(`[LOG][${component}] ${message}`, data !== undefined ? data : '');
    }
  }

  error(component: string, message: string, error?: any) {
    console.error(`[ERROR][${component}] ${message}`, error !== undefined ? error : '');
  }

  info(component: string, message: string, data?: any) {
    if (this.debug) {
      console.info(`[INFO][${component}] ${message}`, data !== undefined ? data : '');
    }
  }
}

export const logger = new Logger({ debug: true });

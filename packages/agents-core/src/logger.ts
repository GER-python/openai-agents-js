import debug from 'debug';
import { logging } from './config';

/**
 * A logger instance with debug, error, warn, and dontLogModelData and dontLogToolData methods.
 */
export type Logger = {
  /**
   * The namespace used for the debug logger.
   */
  namespace: string;

  /**
   * Log a debug message when debug logging is enabled.
   * @param message - The message to log.
   * @param args - The arguments to log.
   */
  debug: (message: string, ...args: any[]) => void;
  /**
   * Log an error message.
   * @param message - The message to log.
   * @param args - The arguments to log.
   */
  error: (message: string, ...args: any[]) => void;
  /**
   * Log a warning message.
   * @param message - The message to log.
   * @param args - The arguments to log.
   */
  warn: (message: string, ...args: any[]) => void;
  /**
   * Whether to log model data.
   */
  dontLogModelData: boolean;
  /**
   * Whether to log tool data.
   */
  dontLogToolData: boolean;
};

/**
 * Get a logger for a given package.
 *
 * @param namespace - the namespace to use for the logger.
 * @returns A logger object with `debug` and `error` methods.
 */
export function getLogger(namespace: string = 'openai-agents'): Logger {
  return {
    namespace,
    debug: debug(namespace),
    error: (...args: any[]) => console.error(...args),
    warn: (...args: any[]) => console.warn(...args),
    get dontLogModelData() {
      return logging.dontLogModelData;
    },
    get dontLogToolData() {
      return logging.dontLogToolData;
    },
  };
}

/**
 * Log a debug message, optionally including detailed model data only when
 * model data logging is enabled.
 *
 * @param log - The logger instance to use.
 * @param summary - A short message logged unconditionally (e.g. "Calling LLM").
 * @param detailFn - A function returning the detailed string to append when
 *   model data logging is enabled. Deferred so serialisation cost is skipped
 *   when unnecessary.
 */
export function debugMaybeData(
  log: Logger,
  summary: string,
  detailFn: () => string,
): void {
  if (log.dontLogModelData) {
    log.debug(summary);
  } else {
    log.debug(`${summary} ${detailFn()}`);
  }
}

export const logger = getLogger('openai-agents:core');

export default logger;

import Server from './server';
import Logger from './logger';

(async () => {
  try {
    await Server.start();
  } catch (e) {
    Logger.error(`Failed to start the application. Cause: ${e}`);
    process.exit(1);
  }
})();

// Gracefully stop the application on SIGINT signal
process.on('SIGINT', () => {
  Logger.info('Stopping application.');

  Server.stop().then(() => {
    Logger.info('Application stopped.');
    process.exit(0);
  });
});

// Stop the application when any uncaught exception happens
process.on('uncaughtException', (err: Error, origin: string) => {
  Logger.error(`Stopping application due to: ${err}:${origin}`);

  Server.stop().then(() => {
    Logger.info('Application stopped.');
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason: Error | unknown, promise: Promise<unknown>) => {
  const errorDetails = reason instanceof Error ? reason?.stack : reason;
  Logger.warn(`Unhandled rejection at promise: ${promise}, reason: ${errorDetails}`);
});

import 'reflect-metadata';
import { Application } from './Application';

const app = new Application();

// eslint-disable-next-line no-undef
function gracefullyShutDownApplication(signal: NodeJS.Signals): void {
  app.logger.warn(`Received ${signal}, shutting down application`);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  app.stop().then(() => { process.exit(0); });
}

// Listen to SIGTERM and SIGINT to gracefully shut down the application
process.on('SIGTERM', gracefullyShutDownApplication);
process.on('SIGINT', gracefullyShutDownApplication);

app.start().catch((e: Error) => {
  app.logger.error(e.message, e);
  process.exit(1);
});

import app from './app.js';
import { config } from './config.js';
import pool from './db/pool.js';

const server = app.listen(config.port, () => {
  console.log(`Xolara API running on http://localhost:${config.port}`);
});

function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    pool.end().then(() => {
      console.log('Pool closed. Goodbye.');
      process.exit(0);
    });
  });
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

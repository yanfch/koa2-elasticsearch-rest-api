import path from 'path';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'hevb-api',
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  },
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      type: 'rotating-file',
      level: 'debug',
      path: path.join(__dirname, '../../../logs', 'server.log'),
      period: '1d',   // daily rotation
      count: 7        // keep 7 back copies
    },
    {
      type: 'rotating-file',
      level: 'error',
      path: path.join(__dirname, '../../../logs', 'error.log'),
      period: '1d',   // daily rotation
      count: 7        // keep 7 back copies
    }
  ]
});

export function createLoggerMiddle(ctx) {
  return async (next) => {
    ctx.logger = logger;
    await next();
  };
}

export default logger;


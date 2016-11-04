export default function errorHandleMiddle() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const errStatus = err.status || 500;
      const errMsg = errStatus === 500 ? 'Internal server error' : err.message;
      ctx.status = errStatus;
      ctx.body = { error_msg: errMsg };
      if (errStatus === 500) ctx.app.emit('error', err, ctx);
    }
  };
}

import Koa from 'koa';
import logger from './util/logs';
import middleware from './middleware';
import errorHandleMiddle from './util/error';
import api from './router';

const app = new Koa();

app.use(errorHandleMiddle());
app.use(middleware());
app.use(api());

app.on('error', (err, ctx) => {
  logger.error({ err, method: `${ctx.method}`, path: `${ctx.path}`, params: ctx.params, query: ctx.query, body: ctx.request.body});
});

export default app;

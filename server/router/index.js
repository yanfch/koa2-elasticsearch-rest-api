import compose from 'koa-compose';
import Router from 'koa-router';
import routes from '../api';

// The default load file in the folder below the index.js
const index = 'index';

// Router default prefix or context path
const router = new Router({ prefix: '/hevb/api' });

// Set router
Object.keys(routes).forEach(name => router.use('/'.concat(name), routes[name][index].routes(), routes[name][index].allowedMethods()));

// 404 handle
router.get('/*', async (ctx) => {
  ctx.status = 404;
  ctx.body = { error_msg: 'Routes not found' };
});

// console router list
if (process.env.NODE_ENV === 'development') {
  for (const layer of router.stack) {
    console.log('path: %s', layer.path, 'methods:', layer.methods);
  }
}

export default function api() {
  return compose([
    router.routes(),
    router.allowedMethods()
  ]);
}

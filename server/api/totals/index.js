import _ from 'lodash';
import Router from 'koa-router';
import Total from '../../model/total';

/* eslint-disable no-underscore-dangle */
const router = new Router();
const total = new Total();

router
  .get('/:id', async (ctx) => {
    try {
      const _total = await total.get(ctx.params);
      if (_.isEmpty(_total)) ctx.throw(404, 'User not found');
      ctx.body = { data: _total._source };
    } catch (err) {
      ctx.throw(err, 'Get total error');
    }
  });

export default router;

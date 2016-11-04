import _ from 'lodash';
import ejs from 'elastic.js';
import moment from 'moment';
import Router from 'koa-router';
import logger from '../../util/logs';
import Total from '../../model/total';
import Record from '../../model/record';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss,SSS';

/* eslint-disable new-cap, no-underscore-dangle */
const router = new Router();
const total = new Total();
const record = new Record();

/**
 * @param {any} data
 * @returns array
 */
function makeResponse(data) {
  const res = {
    scroll_id: data._scroll_id,
    data: []
  };
  for (const val of data.hits.hits) {
    res.data.push(val._source);
  }
  return res;
}

router
  .get('/:openid', async (ctx) => {
    let res = {};
    const size = ctx.query.size || 5;
    const sort = ctx.query.sort || 'create_time';
    const order = ctx.query.order || 'desc';
    try {
      const data = await record.search({
        scroll: '30m',
        body: ejs.Request()
                .query(ejs.TermQuery('openid', ctx.params.openid))
                .sort(ejs.Sort(sort).order(order))
                .size(size)
      });
      res = makeResponse(data);
      logger.trace({ query: ctx.query, params: ctx.params, response: res }, 'Get records by openid scroll response body');
      ctx.body = res;
    } catch (err) {
      ctx.throw(err, 'Get records by openid scroll error');
    }
  })
  .get('/:openid/scroll/:scrollid', async (ctx) => {
    let res = {};
    const scrollid = ctx.params.scrollid;
    try {
      const data = await record.scroll({ scroll: '30m', scrollId: scrollid });
      res = makeResponse(data);
      logger.trace({ params: ctx.params, response: res }, 'Get records scroll response body');
      ctx.body = res;
    } catch (err) {
      ctx.throw(err, 'Get records scroll error');
    }
  })
  .post('/', async (ctx) => {
    const body = ctx.request.body;
    let _total = {};
    try {
      // 总和微币
      const source = (await total.get({ id: body.openid}))._source;
      // 本次获得或者消费数量
      const _thisUseTotal = body.total;
      if (source) {
        _total.id = source.id;
        // 余量计算
        _total.total = _.add(Number(source.total), Number(_thisUseTotal));
        // 增加
        if (_thisUseTotal > 0) _total.sumtotal = _.add(Number(source.sumtotal), Number(_thisUseTotal));
        // 消费
        else {
          if (_.subtract(Number(source.total), Number(-_thisUseTotal)) < 0) ctx.throw(422, '和微币不足，不能消费。');
          _total.consume = _.add(Number(source.consume), Number(-_thisUseTotal));
        }
        // 是否有通过绑定获取和微币
        if (body.is_bind) _total.is_bind = body.is_bind;
        // 手机号
        if (body.telephone) _total.telephone = body.telephone;
        // 昵称
        if (body.nickname) _total.nickname = body.nickname;
        _total.update_time = moment().format(DATE_FORMAT);
      } else {
        if (_thisUseTotal <= 0) ctx.throw(422, '尚未拥有和微币，或者本次获取的和微币数量为0。');
        _total = {
          id: body.openid,
          openid: body.openid,
          telephone: body.telephone,
          nickname: body.nickname,
          total: _thisUseTotal,
          consume: 0,
          sumtotal: _thisUseTotal,
          is_bind: '0',
          channel: body.channel,
          update_time: moment().format(DATE_FORMAT),
          create_time: moment().format(DATE_FORMAT)
        };
      }
      await total.save(_total);
      // 保存本次获取记录
      await record.save({
        id: (`${body.openid}-${+moment()}-${body.operation}`),
        openid: body.openid,
        telephone: body.telephone,
        nickname: body.nickname,
        operation: body.operation,
        operation_remark: body.operation_remark,
        operation_description: body.operation_description,
        total: body.total,
        channel: body.channel,
        create_time: moment().format(DATE_FORMAT)
      });
      logger.trace({ body, _total }, 'Post records request body and save body');
      ctx.body = { success: true, data: {} };
    } catch (err) {
      ctx.throw(err, 'Post records error');
    }
  });

export default router;

import moment from 'moment';
import { merge } from 'lodash';

const postfix = moment().format('YYYY-MM');

const all = {
  elastic: {
    total_index: 'total',
    record_index: `record-${postfix}`,
    record_alias: 'alias',
    index_type: 'type'
  }
};

/* eslint-disable */
const config = merge(all, require(`./${process.env.NODE_ENV}`).default || {});
/* eslint-enable */

export default config;

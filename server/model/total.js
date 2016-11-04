import config from '../config/env';
import Common from './common';

/**
 * @class Total
 * @extends {Common}
 */
class Total extends Common {
  /* eslint-disable no-underscore-dangle */
  constructor() {
    super({ index: config.elastic.total_index, type: config.elastic.index_type });
    this._mapping = {
      mappings: {
        properties: {
          id: {type: 'keyword'},
          openid: {type: 'keyword'},
          telephone: {type: 'keyword'},
          nickname: {type: 'keyword'},
          total: {type: 'long'},
          consume: {type: 'long'},
          sumtotal: {type: 'long'},
          is_bind: {type: 'keyword'},
          channel: {type: 'keyword'},
          update_time: {type: 'date', format: 'yyyy-MM-dd HH:mm:ss,SSS'},
          create_time: {type: 'date', format: 'yyyy-MM-dd HH:mm:ss,SSS'},
          extend1: {type: 'text'},
          extend2: {type: 'text'},
          extend3: {type: 'keyword'},
          extend4: {type: 'keyword'},
          extend5: {type: 'long'}
        }
      }
    };
  }
  indices() {
    return super.indices(this._mapping);
  }
}

export default Total;

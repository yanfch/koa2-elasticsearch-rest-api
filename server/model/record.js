import config from '../config/env';
import Common from './common';

/**
 * @class Record
 * @extends {Common}
 */
class Record extends Common {
  /* eslint-disable no-underscore-dangle */
  constructor() {
    super({ index: config.elastic.record_index, type: config.elastic.index_type, alias: config.elastic.record_alias });
    this._mapping = {
      mappings: {
        properties: {
          id: {type: 'keyword'},
          openid: {type: 'keyword'},
          telephone: {type: 'keyword'},
          nickname: {type: 'keyword'},
          operation: {type: 'long'},
          operation_remark: {type: 'keyword'},
          operation_description: {type: 'keyword'},
          total: {type: 'long'},
          channel: {type: 'keyword'},
          create_time: {type: 'date', format: 'yyyy-MM-dd HH:mm:ss,SSS'},
          extend1: {type: 'keyword'},
          extend2: {type: 'keyword'},
          extend3: {type: 'keyword'},
          extend4: {type: 'long'},
          extend5: {type: 'long'},
          extend6: {type: 'text'},
          extend7: {type: 'text'},
          extend8: {type: 'text'},
          extend9: {type: 'text'},
          extend10: {type: 'text'}
        }
      }
    };
  }
  indices() {
    return super.indices(this._mapping);
  }
  async save(params) {
    await this.indices();
    return await super.save(params);
  }
}

export default Record;

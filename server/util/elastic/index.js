import { merge, clone } from 'lodash';
import elasticsearch from 'elasticsearch';
import config from '../../config/env';

/**
 * Elasticsearch Client
 * @class Elastic
 */
class Elastic {
  /* eslint-disable no-underscore-dangle */
  constructor(opts) {
    this.index = opts.index;
    this.type = opts.type;
    this.alias = opts.alias;
    this.client = new elasticsearch.Client(clone(config.elastic));
    this._searchIndex = (this.alias) ? this.alias : this.index;
  }
  /**
   * create index
   * @param {any} params
   * @memberOf Elastic
   */
  async indices(params) {
    try {
      const exists = await this.client.indices.exists({ index: this.index });
      if (!exists) {
        // settings default
        const settings = (params.settings) ? params.settings : { settings: { number_of_replicas: 1, number_of_shards: 10 }};
        // create index
        await this.client.indices.create({ index: this.index, body: settings });
        // put mapping
        await this.client.indices.putMapping({ index: this.index, type: this.type, body: params.mappings });
        // put alias
        if (this.alias) await this.client.indices.putAlias({ index: this.index, name: this.alias });
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
  /**
   * save (create or update)
   * @param {any} params
   * @returns res
   * @memberOf Elastic
   */
  async save(params) {
    try {
      // 文档是否存在
      const exists = await this.client.exists({ index: this.index, type: this.type, id: params.id });
      if (exists) {
        // 获取合并
        // const history = await this.client.get({ index: this._searchIndex, type: this.type, id: params.id });
        // data = merge(history._source, data);
        return await this.update(params);
      }
      // 保存
      return await this.client.index({ index: this.index, type: this.type, id: params.id, body: params });
    } catch (err) {
      throw err;
    }
  }

  /**
   * update
   * @param {any} params
   * @return res
   * @memberOf Elastic
   */
  async update(params) {
    try {
      return await this.client.update({ index: this.index, type: this.type, id: params.id, body: { doc: params }});
    } catch (err) {
      throw err;
    }
  }
  /**
   * search
   * @param {any} params
   * @returns data
   * @memberOf Elastic
   */
  async search(params) {
    try {
      return await this.client.search(merge({ index: this._searchIndex, type: this.type }, params));
    } catch (err) {
      if (err.message === 'Not Found') return {};
      throw err;
    }
  }
  /**
   * get by id
   * @param {any} params
   * returns data
   * @memberOf Elastic
   */
  async get(params) {
    try {
      return await this.client.get(merge({ index: this._searchIndex, type: this.type}, params));
    } catch (err) {
      if (err.message === 'Not Found') return {};
      throw err;
    }
  }
  /**
   * scroll
   * @param {any} params
   * @returns
   * @memberOf Elastic
   */
  async scroll(params) {
    try {
      return await this.client.scroll(params);
    } catch (err) {
      throw (err);
    }
  }
}

export default Elastic;

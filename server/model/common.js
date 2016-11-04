import Elastic from '../util/elastic';

class Common {
  constructor(opts) {
    this.elastic = new Elastic(opts);
  }
  indices(params) {
    return this.elastic.indices(params);
  }
  save(params) {
    return this.elastic.save(params);
  }
  get(params) {
    return this.elastic.get(params);
  }
  search(params) {
    return this.elastic.search(params);
  }
  scroll(params) {
    return this.elastic.scroll(params);
  }
}

export default Common;

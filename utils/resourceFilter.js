class resourceFilter {
  constructor(resource, query) {
    this.resource = resource;
    this.query = query;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    this.resource = this.resource.find(queryObj);
    return this;
  }
}

module.exports = resourceFilter;

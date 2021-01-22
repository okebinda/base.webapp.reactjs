import Logger from './Logger';

const QueryString = {
  
  make: function(params) {
    if (!params) {
      return '';
    }
    const esc = encodeURIComponent;
    const query = Object.keys(params)
      .filter(x => params[x] !== null)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
    return query;
  },

  append: function(path, params) {
    const qs = QueryString.make(params);
    return qs
      ? (path.includes('?')
          ? path + qs
          : path + '?' + qs)
      : path;
  },

  parse: function(qs) {
    const params = {};
    const pairs = (qs[0] === '?' ? qs.substr(1) : qs).split('&');
    for (var i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        if (pair[0]) {
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
    }
    return params;
  }
};

export default QueryString;

Logger.log('silly', `QueryString loaded.`);

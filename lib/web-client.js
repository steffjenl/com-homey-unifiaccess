const BaseClient = require('./base-class');
const https = require('node:https');
class WebClient extends BaseClient {
  constructor(...props) {
    super(...props);

    this._serverHost = null;
    this._serverPort = 12445;
    this._apiToken = null;
  }

  async get(resource, params = {}) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        hostname: this._serverHost,
        port: this._serverPort,
        path: `/api/v1/developer/${resource}${this.toQueryString(params)}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: '*/*',
          'Authorization': `Bearer ${this._apiToken}`,
        },
        maxRedirects: 20,
        rejectUnauthorized: false,
        keepAlive: true,
      };

      const req = https.request(options, res => {
        const data = [];

        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          if (res.statusCode === 403) {
            return reject(new Error(`Homey user has no permission to perform this action. Please check the user's role.`));
          }

          if (res.statusCode !== 200) {
            return reject(new Error(`Failed to GET url: ${options.path} (status code: ${res.statusCode}, response: ${data.join('')})`));
          }

          return resolve(data.join(''));
        });
      });

      req.on('error', error => reject(error));
      req.end();
    });
  }

  toQueryString(obj) {
    if (obj === null || typeof obj === 'undefined' || Object.keys(obj).length === 0) {
      return '';
    }
    return `?${Object.keys(obj)
      .map(k => `${k}=${encodeURIComponent(obj[k])}`)
      .join('&')}`;
  }
}

module.exports = WebClient;

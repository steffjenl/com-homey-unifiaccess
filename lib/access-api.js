const BaseClient = require('./base-class');
const WebClient = require('./web-client');
const AccessWebSocket = require('./web-socket');

class AccessAPI extends BaseClient {
  constructor(...props) {
    super(...props);
    this.webclient = new WebClient();
    this.websocket = new AccessWebSocket();
  }

  setSettings(host, port, apiToken) {
    this.webclient._serverHost = host;
    this.webclient._serverPort = port;
    this.webclient._apiToken = apiToken;
  }

  setHomeyObject(homey) {
    this.homey = homey;
    this.webclient.setHomeyObject(homey);
    this.websocket.setHomeyObject(homey);
  }

  async getHubs() {
    return new Promise((resolve, reject) => {
      this.webclient.get('devices')
        .then(response => {
          let result = JSON.parse(response);

          let hubs = [];
          for (const device of result.data[0]) {
            if (device.capabilities.includes('is_hub')) {
              hubs.push(device);
            }
          }

          if (hubs) {
            return resolve(hubs);
          } else {
            return reject(new Error('Error obtaining hubs.'));
          }
        })
        .catch(error => reject(error));
    });
  }

  async getReaders() {
    return new Promise((resolve, reject) => {
      this.webclient.get('devices')
        .then(response => {
          let result = JSON.parse(response);

          let readers = [];
          for (const device of result.data[0]) {
            if (device.capabilities.includes('is_reader')) {
              readers.push(device);
            }
          }

          if (readers) {
            return resolve(readers);
          } else {
            return reject(new Error('Error obtaining readers.'));
          }
        })
        .catch(error => reject(error));
    });
  }
}

module.exports = AccessAPI;

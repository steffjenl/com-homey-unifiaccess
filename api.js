const https = require('https');

module.exports = {
  async getStatus({
    homey,
    query
  }) {
    const result = await homey.app.api.loggedInStatus;
    return result;
  },
  async getWebsocketStatus({
    homey,
    query
  }) {
    return homey.app.api.websocket.isWebsocketConnected() ? 'Connected' : 'Unknown';
  },
  async getLastWebsocketMessageTime({
    homey,
    query
  }) {
    return homey.app.api.websocket.getLastWebsocketMessageTime();
  },
  async testCredentials({
    homey,
    body
  }) {
    try {
      return new Promise((resolve, reject) => {
        const options = {
          method: 'GET',
          hostname: body.host,
          port: body.port,
          path: '/api/v1/developer/devices',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            'Authorization': `Bearer ${body.apiToken}`,
          },
          maxRedirects: 20,
          rejectUnauthorized: false,
          timeout: 2000,
          keepAlive: true,
        };

        const req = https.request(options, res => {
          if (res.statusCode !== 200) {
            reject('Invalid credentials');
            return;
          }
          const body = [];

          res.on('data', chunk => body.push(chunk));
          resolve('Valid credentials');
        });

        req.on('error', error => {
          reject('Invalid credentials');
        });
        req.end();
        //});
      }).then((result) => {
        return {
          status: 'success',
        };
      })
        .catch((error) => {
          return {
            status: 'failure',
            error: error,
          };
        });
    } catch (error) {
      console.log('testCredentials error', error);
      return {
        status: 'failure',
        error: error.message,
      };
    }
  }
};

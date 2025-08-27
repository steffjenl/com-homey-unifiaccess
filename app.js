'use strict';

const Homey = require('homey');
const AccessAPI = require('./lib/access-api');

module.exports = class UnifiAccess extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('UnifiAccess has been initialized');
    this.loggedInStatus = 'Unknown';
    this.api = new AccessAPI();
    this.api.setHomeyObject(this.homey);
    await this.loginToAccess();
  }

  async loginToAccess() {
    // Validate NVR IP address
    const nvrip = this.homey.settings.get('ufp:nvrip');
    if (!nvrip) {
      this.debug('NVR IP address not set.');
      return;
    }

    // Setting NVR Port when set
    const nvrport = this.homey.settings.get('ufp:nvrport');

    // Validate NVR credentials
    const credentials = this.homey.settings.get('ufp:credentials');
    if (!credentials) {
      this.debug('Credentials not set.');
      return;
    }

    this.api.setSettings(nvrip, nvrport, credentials.apiToken);

    this.api.websocket.reconnectNotificationsListener();

    this.api.loggedInStatus = 'Connected';
  }

  /**
   * Convert a Homey time to a local time
   * @param {Date} homeyTime
   * @returns {Date}
   */
  toLocalTime(homeyTime) {
    const tz = this.homey.clock.getTimezone();
    const localTime = new Date(homeyTime.toLocaleString('en-US', { timeZone: tz }));
    return localTime;
  }

};

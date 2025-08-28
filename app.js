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

        const _setReaderAccessMethodWaveConfig = this.homey.flow.getActionCard('ufv_set_reader_access_method_wave');
        _setReaderAccessMethodWaveConfig.registerRunListener(async (args, state) => {
            if (typeof args.device.getData().id !== 'undefined') {
                return this.homey.app.api.setReaderWave(args.device.getData().id, args.enabled);
            }
            return Promise.resolve(true);
        });
        const _setReaderAccessMethodNGCConfig = this.homey.flow.getActionCard('ufv_set_reader_access_method_nfc');
        _setReaderAccessMethodNGCConfig.registerRunListener(async (args, state) => {
            if (typeof args.device.getData().id !== 'undefined') {
                return this.homey.app.api.setReaderNFC(args.device.getData().id, args.enabled);
            }
            return Promise.resolve(true);
        });
        const _setReaderAccessMethodMobileButtonConfig = this.homey.flow.getActionCard('ufv_set_reader_access_method_bt-button');
        _setReaderAccessMethodMobileButtonConfig.registerRunListener(async (args, state) => {
            if (typeof args.device.getData().id !== 'undefined') {
                return this.homey.app.api.setReaderMobileButton(args.device.getData().id, args.enabled);
            }
            return Promise.resolve(true);
        });
        const _setReaderAccessMethodMobileTapConfig = this.homey.flow.getActionCard('ufv_set_reader_access_method_bt-tap');
        _setReaderAccessMethodMobileTapConfig.registerRunListener(async (args, state) => {
            if (typeof args.device.getData().id !== 'undefined') {
                return this.homey.app.api.setReaderMobileTap(args.device.getData().id, args.enabled);
            }
            return Promise.resolve(true);
        });
        const _setDoorTempLockingRule = this.homey.flow.getActionCard('ufv_set_reader_door_locking_rule');
        _setDoorTempLockingRule.registerRunListener(async (args, state) => {
            if (typeof args.device.getData().id !== 'undefined') {
                return this.homey.app.api.setTempDoorLockingRule(args.device.getData().id, args.type, args.interval);
            }
            return Promise.resolve(true);
        });

        this.homey.settings.on('set', key => {
            if (key === 'ufp:credentials' || key === 'ufp:nvrip' || key === 'ufp:nvrport') {
                this.loginToAccess();
            }
        });
    }

    async loginToAccess() {
        // Validate NVR IP address
        const nvrip = this.homey.settings.get('ufp:nvrip');
        if (!nvrip) {
            this.log('NVR IP address not set.');
            return;
        }

        // Setting NVR Port when set
        const nvrport = this.homey.settings.get('ufp:nvrport');

        // Validate NVR credentials
        const credentials = this.homey.settings.get('ufp:credentials');
        if (!credentials) {
            this.log('Credentials not set.');
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
        const localTime = new Date(homeyTime.toLocaleString('en-US', {timeZone: tz}));
        return localTime;
    }

};

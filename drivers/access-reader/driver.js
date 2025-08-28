'use strict';

const Homey = require('homey');

module.exports = class ReaderDriver extends Homey.Driver {

    /**
     * onInit is called when the driver is initialized.
     */
    async onInit() {
        this.log('ReaderDriver has been initialized');
    }

    /**
     * onPairListDevices is called when a user is adding a device
     * and the 'list_devices' view is called.
     * This should return an array with the data of devices that are available for pairing.
     */
    async onPairListDevices() {
        const reders = await this.homey.app.api.getReaders();
        return reders.map(reader => ({
            name: reader.name,
            data: {id: String(reader.id)},
            store: {
                location: reader.location_id,
                type: reader.type,
            },
        }));
    }

    onParseWebsocketMessage(device, payload) {
        this.log('onParseWebsocketMessage', device.getName());
        if (Object.prototype.hasOwnProperty.call(device, '_events')) {
            if (payload.hasOwnProperty('access_method')) {
                if (payload.access_method.hasOwnProperty('nfc')) {
                    device.onNfcConfigChange(payload.access_method.nfc === 'yes');
                }
                if (payload.access_method.hasOwnProperty('wave')) {
                    device.onWaveConfigChange(payload.access_method.wave === 'yes');
                }
                if (payload.access_method.hasOwnProperty('bt_button')) {
                    device.onMobileButtonConfigChange(payload.access_method.bt_button === 'yes');
                }
                if (payload.access_method.hasOwnProperty('bt_tap')) {
                    device.onMobileTapConfigChange(payload.access_method.bt_tap === 'yes');
                }
                if (payload.access_method.hasOwnProperty('touch_pass')) {
                    device.onTouchPassConfigChange(payload.access_method.touch_pass === 'yes');
                }
                if (payload.access_method.hasOwnProperty('apple_pass')) {
                    device.onTouchPassConfigChange(payload.access_method.touch_pass === 'yes');
                }
            }
        }
    }

    getUnifiDeviceById(deviceId) {
        try {
            const device = this.getDevice({
                id: deviceId,
            });

            return device;
        } catch (Error) {
            return false;
        }
    }

};

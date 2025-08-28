'use strict';

const Homey = require('homey');

module.exports = class MyDriver extends Homey.Driver {

    /**
     * onInit is called when the driver is initialized.
     */
    async onInit() {
        this.log('MyDriver has been initialized');
    }

    /**
     * onPairListDevices is called when a user is adding a device
     * and the 'list_devices' view is called.
     * This should return an array with the data of devices that are available for pairing.
     */
    async onPairListDevices() {
        const doors = await this.homey.app.api.getDoors();
        return doors.map(door => ({
            name: door.full_name,
            data: {id: String(door.id)},
            store: {
                floor_id: door.floor_id,
                type: door.type,
            },
        }));
    }

    onParseWebsocketMessage(device, payload) {
        this.log('onParseWebsocketMessage', device.getName());
        if (Object.prototype.hasOwnProperty.call(device, '_events')) {
            if (payload.hasOwnProperty('state')) {
                if (payload.state.hasOwnProperty('lock')) {
                    device.onLockChange(payload.state.lock === 'locked');
                }
                if (payload.state.hasOwnProperty('dps')) {
                    device.onDoorChange(payload.state.dps === 'open');
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

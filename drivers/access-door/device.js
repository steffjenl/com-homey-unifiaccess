'use strict';

const Homey = require('homey');

module.exports = class MyDevice extends Homey.Device {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        this.log('MyDevice has been initialized');
        this.registerCapabilityListener('locked', async (value) => {
            console.log('Setting Door Locked to', value);
            if (value) {
                this.log('Locking the door');
                return this.homey.app.api.setTempDoorLockingRule(this.getData().id, 'lock_now');
            } else {
                this.log('Unlocking the door');
                return this.homey.app.api.setDoorUnLock(this.getData().id);
            }
        });
        this.homey.app.api.getDoor(this.getData().id).then(device => {
            if (device) {
                if (typeof device.data.door_lock_relay_status !== 'undefined') {
                    this.setCapabilityValue('locked', device.data.door_lock_relay_status !== 'locked');
                }
                if (typeof device.data.door_position_status !== 'undefined') {
                    this.setCapabilityValue('alarm_contact', device.data.door_position_status === 'open');
                }
            }
        });
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('MyDevice has been added');
    }

    /**
     * onSettings is called when the user updates the device's settings.
     * @param {object} event the onSettings event data
     * @param {object} event.oldSettings The old settings object
     * @param {object} event.newSettings The new settings object
     * @param {string[]} event.changedKeys An array of keys changed since the previous version
     * @returns {Promise<string|void>} return a custom message that will be displayed
     */
    async onSettings({oldSettings, newSettings, changedKeys}) {
        this.log('MyDevice settings where changed');
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name) {
        this.log('MyDevice was renamed');
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        this.log('MyDevice has been deleted');
    }

    onLockChange(value) {
        this.setCapabilityValue('locked', value);
    }

    onDoorChange(value) {
        this.setCapabilityValue('alarm_contact', value);
    }

};

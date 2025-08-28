'use strict';

const Homey = require('homey');

module.exports = class Reader extends Homey.Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('Reader has been initialized');
      this.registerCapabilityListener('reader_nfc_enabled', async (value) => {
          console.log('Setting NFC to', value);
          return this.homey.app.api.setReaderNFC(this.getData().id, value);
      });
      this.registerCapabilityListener('reader_wave_enabled', async (value) => {
          return this.homey.app.api.setReaderWave(this.getData().id, value);
      });
      this.registerCapabilityListener('reader_touch-pass_enabled', async (value) => {
          return this.homey.app.api.setReaderTouchPass(this.getData().id, value);
      });
      this.registerCapabilityListener('reader_mobile-button_enabled', async (value) => {
          return this.homey.app.api.setReaderMobileButton(this.getData().id, value);
      });
      this.registerCapabilityListener('reader_mobile-tap_enabled', async (value) => {
          return this.homey.app.api.setReaderMobileTap(this.getData().id, value);
      });
      //
      this.homey.app.api.getDevice(this.getData().id).then(device => {
            if (device) {
                if (typeof device.data.access_methods !== 'undefined') {
                    if (typeof device.data.access_methods.nfc !== 'undefined') {
                        this.setCapabilityValue('reader_nfc_enabled', device.data.access_methods.nfc.enabled === 'yes');
                    }
                    if (typeof device.data.access_methods.wave !== 'undefined') {
                        this.setCapabilityValue('reader_wave_enabled', device.data.access_methods.wave.enabled === 'yes');
                    }
                    if (typeof device.data.access_methods.touch_pass !== 'undefined') {
                        this.setCapabilityValue('reader_touch-pass_enabled', device.data.access_methods.touch_pass.enabled === 'yes');
                    }
                    if (typeof device.data.access_methods.bt_button !== 'undefined') {
                        this.setCapabilityValue('reader_mobile-button_enabled', device.data.access_methods.bt_button.enabled === 'yes');
                    }
                    if (typeof device.data.access_methods.bt_tap !== 'undefined') {
                        this.setCapabilityValue('reader_mobile-tap_enabled', device.data.access_methods.bt_tap.enabled === 'yes');
                    }
                }
            }
      });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Reader has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('Reader settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('Reader was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Reader has been deleted');
  }

};

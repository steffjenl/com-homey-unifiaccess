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
      data: { id: String(reader.id) },
      store: {
        location: reader.location_id,
        type: reader.type,
      },
    }));
  }

};

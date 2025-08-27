'use strict';

const Homey = require('homey');

module.exports = class HubDriver extends Homey.Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('HubDriver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    const hubs = await this.homey.app.api.getHubs();
    return hubs.map(hub => ({
      name: hub.name,
      data: { id: String(hub.id) },
      store: {
        location: hub.location_id,
        type: hub.type,
      },
    }));
  }

};

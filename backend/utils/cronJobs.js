const cron = require('node-cron');
const { checkVehicleLicenseExpiry } = require('./whatsappNotifications');
const Vehicle = require('../models/Vehicle');

const startExpiryCheckCron = () => {
    // Run every day at 9 AM
    cron.schedule('0 9 * * *', async () => {
        try {
            await checkVehicleLicenseExpiry(Vehicle);
            console.log('Daily license expiry check completed');
        } catch (error) {
            console.error('Error in daily expiry check:', error);
        }
    });
};

module.exports = { startExpiryCheckCron };

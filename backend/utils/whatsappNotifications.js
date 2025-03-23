const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsAppNotification = async (to, message) => {
    try {
        // Check if Twilio credentials are configured
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.warn('Twilio credentials not configured. Skipping WhatsApp notification.');
            return false;
        }

        const client = require('twilio')(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        await client.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
        });
        
        console.log('WhatsApp notification sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        return false;
    }
};

const checkVehicleLicenseExpiry = async (Vehicle) => {
    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const vehicles = await Vehicle.find({
            licenseInsuranceExpiry: {
                $gte: new Date(),
                $lte: thirtyDaysFromNow
            }
        });

        for (const vehicle of vehicles) {
            const expiryDate = new Date(vehicle.licenseInsuranceExpiry).toLocaleDateString();
            const message = `🚨 VEHICLE LICENSE EXPIRY ALERT 🚨\n\n` +
                          `Vehicle Type: ${vehicle.type}\n` +
                          `Vehicle ID: ${vehicle.vehicleId}\n` +
                          `License & Insurance Expiry: ${expiryDate}\n\n` +
                          `Please renew before expiration.`;

            // Send to admin
            await sendWhatsAppNotification(process.env.ADMIN_PHONE_NUMBER, message);
        }
    } catch (error) {
        console.error('Error checking license expiry:', error);
    }
};

module.exports = {
    sendWhatsAppNotification,
    checkVehicleLicenseExpiry
};

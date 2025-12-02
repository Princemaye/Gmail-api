require('dotenv').config();

module.exports = {
    port: process.env.PORT || '3000',

    // Brevo API configuration
    brevoApiKey: process.env.BREVO_API_KEY,

    // Email identity
    emailFrom: process.env.EMAIL_FROM || '"Princetechn Support" <support@princetechn.com>',
    emailReplyTo: process.env.EMAIL_REPLY_TO || 'support@princetechn.com',
};

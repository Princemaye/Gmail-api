require('dotenv').config();
module.exports = {
    port: process.env.PORT || '3000',
    emailPort: process.env.EMAIL_PORT || '465',
    emailHost: process.env.EMAIL_HOST || 'smtp.zoho.com',
    emailUser: process.env.EMAIL_USER || 'support@princetechn.com',
    emailPass: process.env.EMAIL_PASS || 'Princemayel123@',
    emailFrom: process.env.EMAIL_FROM || '"Princetechn Support" <support@princetechn.com>',
    emailReplyTo: process.env.EMAIL_REPLY_TO || 'support@princetechn.com',
};

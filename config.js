require('dotenv').config();

module.exports = {
    port: process.env.PORT || '3000',
    emailPort: process.env.EMAIL_PORT || '465',
    emailHost: process.env.EMAIL_HOST || 'mail.privateemail.com',
    emailUser: process.env.EMAIL_USER || 'auth@giftedtech.my.id',
    emailPass: process.env.EMAIL_PASS || 'Mouricedevs@2030#',
    emailFrom: process.env.EMAIL_FROM || '"Gifted Auth" <auth@giftedtech.my.id>',
    emailReplyTo: process.env.EMAIL_REPLY_TO || 'support@giftedtech.web.id',
}

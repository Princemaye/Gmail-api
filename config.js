require('dotenv').config();

module.exports = {
  port: process.env.PORT || '3000',
  emailPort: process.env.EMAIL_PORT,
  emailHost: process.env.EMAIL_HOST,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM,
  emailReplyTo: process.env.EMAIL_REPLY_TO,
};

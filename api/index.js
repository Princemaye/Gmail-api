/*const fs = require('fs');
const path = require('path');
const config = require('../config');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: true,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const loadTemplate = (templateName, replacements) => {
  try {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} not found`);
    }
    
    let template = fs.readFileSync(templatePath, 'utf8');
    
    for (const [key, value] of Object.entries(replacements)) {
      if (value === undefined || value === null) {
        throw new Error(`Missing replacement value for ${key}`);
      }
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    return template;
  } catch (error) {
    console.error('Template loading error:', error);
    throw new Error('Failed to prepare email template');
  }
};

const sendMail = async ({ to, subject, template, replacements }) => {
  try {
    if (!to || !isValidEmail(to)) {
      throw new Error('Invalid recipient email address');
    }
    if (!subject) {
      throw new Error('Email subject is required');
    }
    if (!template) {
      throw new Error('Email template is required');
    }

    const html = loadTemplate(template, replacements);
    
    const mailOptions = {
      from: config.emailFrom,
      to,
      replyTo: config.emailReplyTo,
      subject,
      html,
      headers: {
        'X-Priority': '1',
        'X-Mailer': 'GiftedMailer'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent to ${to}`, {
      messageId: info.messageId,
      subject: subject
    });
    
    return { 
      success: true, 
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    };
  } catch (error) {
    console.error('Email sending failed:', {
      to: to,
      error: error.message,
      stack: error.stack
    });
    
    return { 
      success: false, 
      error: error.message,
      code: error.code || 'EMAIL_SEND_FAILED'
    };
  }
};


const sendSignupCode = async (email, username, code) => {
  if (!code || code.length < 6) {
    return {
      success: false,
      error: 'Verification code must be at least 6 characters',
      code: 'INVALID_CODE'
    };
  }
  
  return sendMail({
    to: email,
    subject: 'VERIFY YOUR ACCOUNT',
    template: 'signup',
    replacements: {
      username: username || 'User',
      code,
      year: new Date().getFullYear(),
      supportEmail: config.emailReplyTo
    },
  });
};

const sendResetCode = async (email, username, code) => {
  if (!code || code.length < 6) {
    return {
      success: false,
      error: 'Verification code must be at least 6 characters',
      code: 'INVALID_CODE'
    };
  }
  
  return sendMail({
    to: email,
    subject: 'PASSWORD RESET REQUEST',
    template: 'reset',
    replacements: {
      username: username || 'User',
      code,
      year: new Date().getFullYear(),
      supportEmail: config.emailReplyTo
    },
  });
};

const sendResendCode = async (email, username, code) => {
  if (!code || code.length < 6) {
    return {
      success: false,
      error: 'Verification code must be at least 6 characters',
      code: 'INVALID_CODE'
    };
  }
  
  return sendMail({
    to: email,
    subject: 'NEW VERIFICATION CODE',
    template: 'resend',
    replacements: {
      username: username || 'User',
      code,
      year: new Date().getFullYear(),
      supportEmail: config.emailReplyTo
    },
  });
};

const sendDeleteCode = async (email, username, code) => {
  if (!code || code.length < 6) {
    return {
      success: false,
      error: 'Verification code must be at least 6 characters',
      code: 'INVALID_CODE'
    };
  }
  
  return sendMail({
    to: email,
    subject: 'CONFIRM ACCOUNT DELETION',
    template: 'delete',
    replacements: {
      username: username || 'User',
      code,
      year: new Date().getFullYear(),
      supportEmail: config.emailReplyTo
    },
  });
};

module.exports = {
  sendMail,
  sendSignupCode,
  sendResetCode,
  sendResendCode,
  sendDeleteCode,
  isValidEmail
};

*/

const fs = require('fs');
const path = require('path');
const config = require('../config');
const nodemailer = require('nodemailer');
/*
const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: true,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});
*/

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: config.emailPort === '465', // true for SSL, false for TLS
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const loadTemplate = (templateName, replacements) => {
  try {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} not found`);
    }
    
    let template = fs.readFileSync(templatePath, 'utf8');
    
    for (const [key, value] of Object.entries(replacements)) {
      if (value === undefined || value === null) {
        throw new Error(`Missing replacement value for ${key}`);
      }
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    return template;
  } catch (error) {
    console.error('Template loading error:', error);
    throw new Error('Failed to prepare email template');
  }
};

const sendMail = async ({ to, subject, template, replacements, text }) => {
  try {
    if (!to || !isValidEmail(to)) {
      throw new Error('Invalid recipient email address');
    }
    if (!subject) {
      throw new Error('Email subject is required');
    }
    if (!template) {
      throw new Error('Email template is required');
    }

    const html = loadTemplate(template, replacements);
    
    // Generate a plain text version if not provided
    let plainText = text;
    if (!plainText) {
      // Fallback: Strip HTML tags for a simple plain text version (basic implementation)
      plainText = html.replace(/<\/?[^>]+(>|$)/g, "");
    }
    
    const mailOptions = {
      from: config.emailFrom,
      to,
      replyTo: config.emailReplyTo,
      subject,
      html,
      text: plainText,
      headers: {
        'X-Priority': '1',
        'X-Mailer': 'GiftedMailer'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent to ${to}`, {
      messageId: info.messageId,
      subject: subject
    });
    
    return { 
      success: true, 
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    };
  } catch (error) {
    console.error('Email sending failed:', {
      to: to,
      error: error.message,
      stack: error.stack
    });
    
    return { 
      success: false, 
      error: error.message,
      code: error.code || 'EMAIL_SEND_FAILED'
    };
  }
};


const sendSignupCode = async (email, username, code) => {
  if (!code || code.length < 6) {
    return {
      success: false,
      error: 'Verification code must be at least 6 characters',
      code: 'INVALID_CODE'
    };
  }

  // Add a sensible plain text body
  const text = `Hello ${username || 'User'},\nYour verification code is: ${code}\nIf you did not request this, please ignore this email.\n\nBest regards,\nSupport Team`;

  return sendMail({
    to: email,
    subject: 'VERIFY YOUR ACCOUNT',
    template: 'signup',
    replacements: {
      username: username || 'User',
      code,
      year: new Date().getFullYear(),
      supportEmail: config.emailReplyTo
    },
    text
  });
};

const sendResetCode = async (email, username, code) => {
  if (!code || code.length < 6) {
    return {
      success: false,
      error: 'Verification code must be at least 6 characters',
      code: 'INVALID_CODE'
    };
  }

  const text = `Hello ${username || 'User'},\nYour password reset code is: ${code}\nIf you did not request this, please contact support.\n\nBest regards,\nSupport Team`;

  return sendMail({
    to: email,
    subject: 'PASSWORD RESET REQUEST',
    template: 'reset',
    replacements: {
      username: username || 'User',
      code,
      year: new Date().getFullYear(),
      supportEmail: config.emailReplyTo
    },
    text
  });
};

const sendResendCode = async (email, username, code) => {
  if (!code || code.length < 6) {
    return {
      success: false,
      error: 'Verification code must be at least 6 characters',
      code: 'INVALID_CODE'
    };
  }

  const text = `Hello ${username || 'User'},\nYour new verification code is: ${code}\nIf you did not request this, please ignore this email.\n\nBest regards,\nSupport Team`;

  return sendMail({
    to: email,
    subject: 'NEW VERIFICATION CODE',
    template: 'resend',
    replacements: {
      username: username || 'User',
      code,
      year: new Date().getFullYear(),
      supportEmail: config.emailReplyTo
    },
    text
  });
};

const sendDeleteCode = async (email, username, code) => {
  if (!code || code.length < 6) {
    return {
      success: false,
      error: 'Verification code must be at least 6 characters',
      code: 'INVALID_CODE'
    };
  }

  const text = `Hello ${username || 'User'},\nTo confirm your account deletion, use this code: ${code}\nIf you did not request this, please ignore this email.\n\nBest regards,\nSupport Team`;

  return sendMail({
    to: email,
    subject: 'CONFIRM ACCOUNT DELETION',
    template: 'delete',
    replacements: {
      username: username || 'User',
      code,
      year: new Date().getFullYear(),
      supportEmail: config.emailReplyTo
    },
    text
  });
};

module.exports = {
  sendMail,
  sendSignupCode,
  sendResetCode,
  sendResendCode,
  sendDeleteCode,
  isValidEmail
};


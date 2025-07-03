const path = require('path');
const express = require('express');
const config = require('./config');
const { sendSignupCode, sendResetCode, sendResendCode, sendDeleteCode, isValidEmail } = require('./api');
const app = express();
app.use(express.json());
app.set('json spaces', 2);

app.use(express.static(path.join(__dirname, 'public')))

const validateEmailRequest = (req, res, next) => {
  const { username, email, code } = req.body;
  
  if (!username || !email || !code) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Username, email and code are required'
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      error: 'Invalid email address',
      details: 'Please provide a valid email address'
    });
  }

  if (code.length < 6) {
    return res.status(400).json({ 
      error: 'Invalid code',
      details: 'Verification code must be at least 6 characters'
    });
  }

  next();
};


app.post('/api/sendSignupCode', validateEmailRequest, async (req, res) => {
  const { email, username, code } = req.body;
  
  try {
    const result = await sendSignupCode(email, username, code);
    
    if (result.success) {
      res.json({ 
        success: true,
        message: 'Signup code sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error,
        details: result.code || 'EMAIL_SEND_FAILED'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});


app.post('/api/sendResetCode', validateEmailRequest, async (req, res) => {
  const { email, username, code } = req.body;
  
  try {
    const result = await sendResetCode(email, username, code);
    
    if (result.success) {
      res.json({ 
        success: true,
        message: 'Password reset code sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error,
        details: result.code || 'EMAIL_SEND_FAILED'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});


app.post('/api/sendResendCode', validateEmailRequest, async (req, res) => {
  const { email, username, code } = req.body;
  
  try {
    const result = await sendResendCode(email, username, code);
    
    if (result.success) {
      res.json({ 
        success: true,
        message: 'Code resent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error,
        details: result.code || 'EMAIL_SEND_FAILED'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});


app.post('/api/sendDeleteCode', validateEmailRequest, async (req, res) => {
  const { email, username, code } = req.body;
  
  try {
    const result = await sendDeleteCode(email, username, code);
    
    if (result.success) {
      res.json({ 
        success: true,
        message: 'Account deletion code sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error,
        details: result.code || 'EMAIL_SEND_FAILED'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});


app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
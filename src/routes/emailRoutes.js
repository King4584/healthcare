const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');
const emailConfig = require('../config/emailConfig');

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Create email transporter
const transporter = nodemailer.createTransport(emailConfig);

// Test email configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Email sending endpoint
router.post('/send-email', upload.single('pdf'), async (req, res) => {
  try {
    console.log('=== Email Request Details ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    if (!req.file) {
      console.error('No file received in request');
      return res.status(400).json({ error: 'No PDF file received' });
    }

    console.log('File details:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    const { email, subject, message } = req.body;
    
    if (!email) {
      console.error('No email address provided');
      return res.status(400).json({ error: 'Email address is required' });
    }

    console.log('Preparing to send email to:', email);
    const pdfAttachment = req.file;

    if (!email || !pdfAttachment) {
      console.log('Validation failed:', { email: !!email, pdfAttachment: !!pdfAttachment });
      return res.status(400).json({ error: 'Email and PDF file are required' });
    }

    // Create email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject || 'Your Diet Plan',
      text: message || 'Please find your diet plan attached.',
      attachments: [
        {
          filename: pdfAttachment.originalname,
          content: pdfAttachment.buffer,
          contentType: 'application/pdf',
        },
      ],
    };

    console.log('Attempting to send email with options:', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      attachmentName: mailOptions.attachments[0].filename
    });

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);

    res.json({ 
      message: 'Email sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message,
      code: error.code 
    });
  }
});

// Temporary debug route to verify file upload parsing (multer)
router.post('/debug-upload', upload.single('pdf'), (req, res) => {
  try {
    console.log('=== Debug Upload Request ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));

    if (!req.file) {
      console.error('Debug: no file received');
      return res.status(400).json({ error: 'No file received' });
    }

    const info = {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferPresent: !!req.file.buffer
    };

    console.log('Debug: file info:', info);
    res.json({ message: 'Debug upload received', file: info });
  } catch (err) {
    console.error('Debug upload error:', err && err.message);
    res.status(500).json({ error: 'Debug upload failed', details: err && err.message });
  }
});

module.exports = router;
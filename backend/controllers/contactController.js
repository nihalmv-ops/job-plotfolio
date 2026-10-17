import Contact from '../models/Contact.js';
import mongoose from 'mongoose';

export const handleContactSubmission = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const errors = {};

    // Validate Name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      errors.name = 'Name cannot exceed 100 characters';
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    // Validate Message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      errors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (message.trim().length > 2000) {
      errors.message = 'Message cannot exceed 2000 characters';
    }

    // If validation fails, return 400 Bad Request
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted errors.',
        errors
      });
    }

    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ipAddress: req.ip || req.headers['x-forwarded-for'] || ''
    };

    // If MongoDB is connected, store in database
    if (mongoose.connection.readyState === 1) {
      const newContact = new Contact(sanitizedData);
      await newContact.save();
      console.log(`📩 [Contact API] New message saved from: ${sanitizedData.email}`);
    } else {
      console.log(`📩 [Contact API] Received message from: ${sanitizedData.email} (MongoDB decoupled mode)`);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received successfully.'
    });
  } catch (error) {
    console.error('❌ [Contact API Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred while processing your request. Please try again later.'
    });
  }
};

const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const nodemailer = require('nodemailer');
const { exportToExcel, appendToExcel } = require('../utils/excelExport');
const { protect, authorize } = require('../middleware/authMiddleware');

// Configure email transporter
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} catch (error) {
  console.error('❌ Error creating email transporter:', error.message);
}

// POST route to handle form submission (Public)
router.post('/submit', async (req, res) => {
  try {
    console.log('📝 Received Form Submission:', req.body);

    // Save form data to database
    const formData = new Form(req.body);
    const savedData = await formData.save();
    console.log('✅ Data saved to MongoDB:', savedData._id);

    // Automatically update Excel sheet
    await appendToExcel(formData);

    // Send email notification (only if transporter is configured)
    if (transporter) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Sending to yourself (HR account) for verification
        subject: `New Internship Application: ${formData.package}`,
        html: `
          <h2>New Internship Application Received</h2>
          <p><strong>Name:</strong> ${formData.fullName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Program:</strong> ${formData.program}</p>
          <p><strong>Package:</strong> ${formData.package}</p>
          <p><strong>Duration:</strong> ${formData.experience} Months</p>
          <p><strong>Ready to Commit:</strong> ${formData.readyToCommit}</p>
          ${formData.message ? `<p><strong>Message:</strong> ${formData.message}</p>` : ''}
        `
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ HR Notification Email sent:', info.messageId);
      } catch (emailError) {
        console.error('❌ Error sending HR notification email:', emailError.message);
        // We don't fail the request if only email fails, but we log it
      }
    } else {
      console.warn('⚠️ Email notification skipped: Transporter not configured.');
    }

    res.status(200).json({
      message: 'Submitted Successfully!',
      success: true
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      message: 'Error submitting form',
      error: error.message,
      success: false
    });
  }
});

// GET route to retrieve all forms (Protected)
router.get('/', protect, authorize('admin', 'hr'), async (req, res) => {
  try {
    const forms = await Form.find().sort({ submittedAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      message: 'Error fetching forms',
      error: error.message
    });
  }
});

// Route to export data to Excel (Manual Download) (Protected)
router.get('/export-excel', protect, authorize('admin', 'hr'), async (req, res) => {
  try {
    const buffer = await exportToExcel();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=applications_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    res.send(buffer);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({
      message: 'Error exporting to Excel',
      error: error.message
    });
  }
});

module.exports = router;

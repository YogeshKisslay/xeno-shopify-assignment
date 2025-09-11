// const nodemailer = require('nodemailer');

// const sendVerificationEmail = async (userEmail, token) => {
//   // 1. Create a transporter object using Gmail SMTP
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   // 2. Define the verification URL
//   // We'll use the standard Vite port for the frontend dev server
//   const verificationUrl = `http://localhost:5173/verify-email/${token}`;

//   // 3. Set up email data
//   const mailOptions = {
//     from: `"Xeno Insights" <${process.env.EMAIL_USER}>`,
//     to: userEmail,
//     subject: 'Please Verify Your Email Address',
//     html: `
//       <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
//         <h2>Thank you for registering!</h2>
//         <p>Please click the button below to verify your email address.</p>
//         <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px;">
//           Verify Email
//         </a>
//         <p style="margin-top: 20px;">If you did not create an account, no further action is required.</p>
//       </div>
//     `,
//   };

//   // 4. Send the email
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Verification email sent successfully.');
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//   }
// };

// module.exports = { sendVerificationEmail };


// server/src/services/emailService.js
// server/src/services/emailService.js

const nodemailer = require('nodemailer');

const sendVerificationEmail = async (userEmail, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // --- FIX: Provide a fallback to the default local frontend URL ---
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationUrl = `${frontendUrl}/verify-email/${token}`;

  const mailOptions = {
    from: `"Xeno Insights" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Please Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h2>Thank you for registering!</h2>
        <p>Please click the button below to verify your email address.</p>
        <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px;">
          Verify Email
        </a>
        <p style="margin-top: 20px;">If you did not create an account, no further action is required.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully.');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

module.exports = { sendVerificationEmail };
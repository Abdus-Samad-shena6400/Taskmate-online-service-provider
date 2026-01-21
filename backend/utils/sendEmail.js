const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If SMTP not configured, log and return gracefully
    if (!process.env.SMPT_MAIL || !process.env.SMPT_PASSWORD) {
        console.warn('SMTP not configured (SMPT_MAIL/SMPT_PASSWORD missing). Skipping sending email.');
        console.log('Email options:', options);
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            service: process.env.SMPT_SERVICE,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        // Log the error but don't throw so forgot password flow can continue in development
        console.error('Failed to send email:', err.message);
        console.error(err);
    }
};

module.exports = sendEmail;

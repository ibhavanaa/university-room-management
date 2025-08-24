const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // you can switch to SMTP for production
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Univ Infra System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`📧 Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
    }
};

import nodemailer from "nodemailer"
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
export async function sendOTPEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"Campus Delivery Bot" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your CampusBot account",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Campus Delivery Bot Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  })
}
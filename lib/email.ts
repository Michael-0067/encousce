import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  to: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@encousce.com",
    to,
    subject: "Reset your Encousce password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f0f11;color:#e8e0d4;padding:40px;border-radius:12px;">
        <h2 style="font-size:24px;margin-bottom:16px;color:#f0e6d8;">Reset your password</h2>
        <p style="color:#c8bcac;margin-bottom:24px;line-height:1.6;">
          Click the button below to reset your Encousce password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:14px 28px;background:#8b4f8b;color:#f0e6d8;text-decoration:none;border-radius:8px;font-weight:500;">
          Reset Password
        </a>
        <p style="color:#4a4460;font-size:12px;margin-top:32px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

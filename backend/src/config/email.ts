const emailConfig = {
  email: {
    host: process.env.EMAIL_HOST || "smtp.example.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    user: process.env.EMAIL_USER || "your-email@example.com",
    pass: process.env.EMAIL_PASSWORD || "your-password",
    from: process.env.EMAIL_FROM || "Your Company <no-reply@example.com>",
  },
};

export default emailConfig;

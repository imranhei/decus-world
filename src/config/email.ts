export const emailConfig = {
  enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === "true",
  from: process.env.RESEND_FROM_EMAIL || "Decus World <onboarding@resend.dev>",
  adminOrderEmail: process.env.ADMIN_ORDER_EMAIL,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

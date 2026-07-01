import { emailConfig } from "@/config/email";
import { AdminNewOrderEmail } from "@/emails/admin-new-order-email";
import { PasswordResetEmail } from "@/emails/password-reset-email";
import { resend } from "@/lib/resend";

export async function sendPasswordResetEmail({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}) {
  if (!emailConfig.enabled) return;
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: emailConfig.from,
    to: email,
    subject: "Reset your Decus World password",
    react: PasswordResetEmail({
      resetUrl,
    }),
  });
}

export async function sendAdminNewOrderEmail({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  total,
}: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
}) {
  if (!emailConfig.enabled) return;
  if (!process.env.RESEND_API_KEY) return;
  if (!emailConfig.adminOrderEmail) return;

  await resend.emails.send({
    from: emailConfig.from,
    to: emailConfig.adminOrderEmail,
    subject: `New order placed - ${orderNumber}`,
    react: AdminNewOrderEmail({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      total,
    }),
  });
}

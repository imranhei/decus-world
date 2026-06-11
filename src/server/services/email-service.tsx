import { emailConfig } from "@/config/email";
import { resend } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation-email";
import { AdminNewOrderEmail } from "@/emails/admin-new-order-email";

type OrderEmailPayload = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    total: number;
  }[];
};

export async function sendOrderConfirmationEmail(payload: OrderEmailPayload) {
  if (!emailConfig.enabled) return;
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: emailConfig.from,
    to: payload.customerEmail,
    subject: `Order confirmed - ${payload.orderNumber}`,
    react: (
      <OrderConfirmationEmail
        customerName={payload.customerName}
        orderNumber={payload.orderNumber}
        total={payload.total}
        items={payload.items}
      />
    ),
  });
}

export async function sendAdminNewOrderEmail(payload: OrderEmailPayload) {
  if (!emailConfig.enabled) return;
  if (!emailConfig.adminOrderEmail) return;
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: emailConfig.from,
    to: emailConfig.adminOrderEmail,
    subject: `New order received - ${payload.orderNumber}`,
    react: (
      <AdminNewOrderEmail
        orderNumber={payload.orderNumber}
        customerName={payload.customerName}
        customerPhone={payload.customerPhone}
        customerEmail={payload.customerEmail}
        total={payload.total}
      />
    ),
  });
}
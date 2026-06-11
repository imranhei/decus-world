import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type OrderEmailItem = {
  name: string;
  quantity: number;
  total: number;
};

type OrderConfirmationEmailProps = {
  customerName: string;
  orderNumber: string;
  total: number;
  items: OrderEmailItem[];
};

export function OrderConfirmationEmail({
  customerName,
  orderNumber,
  total,
  items,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Decus World order has been placed</Preview>

      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px" }}>
          <Heading>Order Confirmed</Heading>

          <Text>Hi {customerName},</Text>

          <Text>
            Your Cash on Delivery order has been placed successfully.
          </Text>

          <Text>
            <strong>Order Number:</strong> {orderNumber}
          </Text>

          <Hr />

          <Section>
            {items.map((item) => (
              <Text key={item.name}>
                {item.name} x {item.quantity} — ৳{item.total}
              </Text>
            ))}
          </Section>

          <Hr />

          <Text>
            <strong>Total:</strong> ৳{total}
          </Text>

          <Text>Thank you for shopping with Decus World.</Text>
        </Container>
      </Body>
    </Html>
  );
}
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type AdminNewOrderEmailProps = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  total: number;
};

export function AdminNewOrderEmail({
  orderNumber,
  customerName,
  customerPhone,
  customerEmail,
  total,
}: AdminNewOrderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New order received: {orderNumber}</Preview>

      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px" }}>
          <Heading>New Order Received</Heading>

          <Text>
            <strong>Order Number:</strong> {orderNumber}
          </Text>

          <Hr />

          <Text>
            <strong>Customer:</strong> {customerName}
          </Text>

          <Text>
            <strong>Phone:</strong> {customerPhone}
          </Text>

          <Text>
            <strong>Email:</strong> {customerEmail}
          </Text>

          <Text>
            <strong>Total:</strong> ৳{total}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type PasswordResetEmailProps = {
  resetUrl: string;
};

export function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Decus World password</Preview>

      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px" }}>
          <Heading>Password Reset Request</Heading>

          <Text>
            We received a request to reset your Decus World account password.
          </Text>

          <Button
            href={resetUrl}
            style={{
              backgroundColor: "#111827",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Reset Password
          </Button>

          <Text>
            This link will expire in 30 minutes. If you did not request this,
            you can ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
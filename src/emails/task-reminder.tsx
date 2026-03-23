import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
  Preview,
} from "@react-email/components";

interface TaskReminderProps {
  userName: string;
  taskTitle: string;
  taskDescription: string | null;
  dueDate: string;
  daysUntilDue: number;
  appUrl: string;
}

function getDueLabel(days: number): string {
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

function getDueColor(days: number): string {
  if (days < 0) return "#dc2626";
  if (days === 0) return "#d97706";
  return "#57534e";
}

export function TaskReminder({
  userName = "there",
  taskTitle = "Check smoke detectors",
  taskDescription = null,
  dueDate = "Mar 25",
  daysUntilDue = 0,
  appUrl = "https://homebase.app",
}: TaskReminderProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {getDueLabel(daysUntilDue)}: {taskTitle}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Branded Header */}
          <Section style={header}>
            <Text style={headerText}>Homebase</Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>
            <Text style={intro}>
              You have a maintenance task{" "}
              {daysUntilDue === 0 ? "due today" : "coming up"}:
            </Text>

            {/* Task Card */}
            <Section style={taskCard}>
              <Heading as="h2" style={taskTitleStyle}>
                {taskTitle}
              </Heading>
              {taskDescription && (
                <Text style={taskDesc}>{taskDescription}</Text>
              )}
              <Text
                style={{
                  ...dueDateStyle,
                  color: getDueColor(daysUntilDue),
                }}
              >
                {getDueLabel(daysUntilDue)} &middot; {dueDate}
              </Text>
            </Section>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button href={`${appUrl}/tasks`} style={button}>
                View Task
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you enabled email reminders.
            </Text>
            <Text style={footerText}>
              <a href={`${appUrl}/settings`} style={footerLink}>
                Manage notification preferences
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default TaskReminder;

// ── Styles ─────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#faf9f7",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: "480px",
  margin: "0 auto",
};

const header: React.CSSProperties = {
  backgroundColor: "#5f6f52",
  padding: "20px 24px",
  borderRadius: "12px 12px 0 0",
};

const headerText: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  margin: 0,
  letterSpacing: "-0.02em",
};

const content: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "24px",
};

const greeting: React.CSSProperties = {
  fontSize: "15px",
  color: "#1c1917",
  margin: "0 0 4px 0",
};

const intro: React.CSSProperties = {
  fontSize: "14px",
  color: "#57534e",
  margin: "0 0 16px 0",
};

const taskCard: React.CSSProperties = {
  backgroundColor: "#faf9f7",
  border: "1px solid #e7e5e4",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "20px",
};

const taskTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1c1917",
  margin: "0 0 6px 0",
};

const taskDesc: React.CSSProperties = {
  fontSize: "13px",
  color: "#78716c",
  margin: "0 0 10px 0",
  lineHeight: "1.5",
};

const dueDateStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  margin: 0,
};

const ctaSection: React.CSSProperties = {
  textAlign: "center" as const,
};

const button: React.CSSProperties = {
  backgroundColor: "#5f6f52",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: "10px",
  textDecoration: "none",
  display: "inline-block",
};

const divider: React.CSSProperties = {
  borderColor: "#e7e5e4",
  margin: 0,
};

const footer: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "16px 24px 20px",
  borderRadius: "0 0 12px 12px",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#a8a29e",
  margin: "0 0 4px 0",
  textAlign: "center" as const,
};

const footerLink: React.CSSProperties = {
  color: "#5f6f52",
  textDecoration: "underline",
};

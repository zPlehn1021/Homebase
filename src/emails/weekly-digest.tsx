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
  Row,
  Column,
} from "@react-email/components";

interface DigestTask {
  title: string;
  category: string;
  dueDate: string;
}

interface WeeklyDigestProps {
  userName: string;
  upcomingTasks: DigestTask[];
  overdueCount: number;
  completedThisYear: number;
  appUrl: string;
}

export function WeeklyDigest({
  userName = "there",
  upcomingTasks = [],
  overdueCount = 0,
  completedThisYear = 0,
  appUrl = "https://homebase.app",
}: WeeklyDigestProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your weekly home maintenance digest
        {overdueCount > 0 ? ` — ${overdueCount} overdue` : ""}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Branded Header */}
          <Section style={header}>
            <Text style={headerText}>Homebase</Text>
          </Section>

          <Section style={content}>
            {/* Greeting */}
            <Text style={greeting}>Hi {userName},</Text>
            <Text style={intro}>
              Here&apos;s your weekly home maintenance summary.
            </Text>

            {/* Stats Row */}
            <Section style={statsRow}>
              <Row>
                <Column style={statBox}>
                  <Text
                    style={{
                      ...statNumber,
                      color: overdueCount > 0 ? "#dc2626" : "#57534e",
                    }}
                  >
                    {overdueCount}
                  </Text>
                  <Text style={statLabel}>Overdue</Text>
                </Column>
                <Column style={statBox}>
                  <Text style={statNumber}>{upcomingTasks.length}</Text>
                  <Text style={statLabel}>This Week</Text>
                </Column>
                <Column style={statBox}>
                  <Text style={{ ...statNumber, color: "#5f6f52" }}>
                    {completedThisYear}
                  </Text>
                  <Text style={statLabel}>Done This Year</Text>
                </Column>
              </Row>
            </Section>

            {/* Upcoming Tasks */}
            <Heading as="h2" style={sectionTitle}>
              This Week
            </Heading>

            {upcomingTasks.length === 0 ? (
              <Section style={emptyState}>
                <Text style={emptyText}>
                  No tasks due this week. Nice work staying on top of things!
                </Text>
              </Section>
            ) : (
              <>
                {upcomingTasks.slice(0, 10).map((task, i) => (
                  <Section key={i} style={taskRow}>
                    <Text style={taskTitle}>{task.title}</Text>
                    <Text style={taskMeta}>
                      {task.category} &middot; {task.dueDate}
                    </Text>
                  </Section>
                ))}
                {upcomingTasks.length > 10 && (
                  <Text style={moreText}>
                    +{upcomingTasks.length - 10} more tasks
                  </Text>
                )}
              </>
            )}

            {/* Completion encouragement */}
            {completedThisYear > 0 && (
              <Section style={encouragement}>
                <Text style={encouragementText}>
                  You&apos;ve completed {completedThisYear} task
                  {completedThisYear === 1 ? "" : "s"} this year. Keep it up!
                </Text>
              </Section>
            )}

            {/* CTA */}
            <Section style={ctaSection}>
              <Button href={appUrl} style={button}>
                View Dashboard
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you enabled the weekly digest.
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

export default WeeklyDigest;

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
  margin: "0 0 20px 0",
};

const statsRow: React.CSSProperties = {
  backgroundColor: "#faf9f7",
  border: "1px solid #e7e5e4",
  borderRadius: "12px",
  padding: "16px 8px",
  marginBottom: "24px",
};

const statBox: React.CSSProperties = {
  textAlign: "center" as const,
};

const statNumber: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#1c1917",
  margin: "0 0 2px 0",
};

const statLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 500,
  color: "#a8a29e",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: 0,
};

const sectionTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#1c1917",
  margin: "0 0 12px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.03em",
};

const taskRow: React.CSSProperties = {
  borderBottom: "1px solid #f5f5f4",
  paddingBottom: "10px",
  marginBottom: "10px",
};

const taskTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#1c1917",
  margin: "0 0 2px 0",
};

const taskMeta: React.CSSProperties = {
  fontSize: "12px",
  color: "#a8a29e",
  margin: 0,
};

const moreText: React.CSSProperties = {
  fontSize: "13px",
  color: "#78716c",
  fontStyle: "italic" as const,
  margin: "0 0 16px 0",
};

const emptyState: React.CSSProperties = {
  backgroundColor: "#f0fdf4",
  borderRadius: "10px",
  padding: "14px 16px",
  marginBottom: "20px",
};

const emptyText: React.CSSProperties = {
  fontSize: "13px",
  color: "#166534",
  margin: 0,
};

const encouragement: React.CSSProperties = {
  backgroundColor: "#faf9f7",
  borderRadius: "10px",
  padding: "12px 16px",
  marginTop: "16px",
  marginBottom: "20px",
};

const encouragementText: React.CSSProperties = {
  fontSize: "13px",
  color: "#5f6f52",
  fontWeight: 500,
  margin: 0,
};

const ctaSection: React.CSSProperties = {
  textAlign: "center" as const,
  marginTop: "8px",
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

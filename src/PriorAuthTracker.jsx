import React, { useMemo, useState } from "react";

const BRAND = {
  white: "#FFFFFF",
  orange: "#FF8200",
  black: "#000000",
  warmGray: "#E8E1D8",
  softGray: "#F7F4EF",
  textGray: "#4B4B4B",
  ink: "#222222"
};

const authRequests = [
  {
    id: "PA-001",
    patientRisk: "High",
    payer: "BCBS TN",
    service: "MRI lumbar spine",
    status: "Pending payer review",
    tier: "Tier 1",
    age: 6,
    documentation: "Clinical notes attached",
    missingItem: "None",
    owner: "Prior Auth Coordinator",
    nextAction: "Call payer for status update",
    defectSource: "Payer follow-up",
    escalation: "Today"
  },
  {
    id: "PA-002",
    patientRisk: "High",
    payer: "TennCare MCO",
    service: "Specialist referral",
    status: "Missing documentation",
    tier: "Tier 1",
    age: 4,
    documentation: "Incomplete",
    missingItem: "Visit note with medical necessity",
    owner: "Clinical Documentation Owner",
    nextAction: "Request updated provider note",
    defectSource: "Documentation readiness",
    escalation: "Today"
  },
  {
    id: "PA-003",
    patientRisk: "Medium",
    payer: "Medicare Advantage",
    service: "Home health services",
    status: "Submitted",
    tier: "Tier 2",
    age: 3,
    documentation: "Complete",
    missingItem: "None",
    owner: "Referral Coordinator",
    nextAction: "Monitor payer portal",
    defectSource: "Authorization queue",
    escalation: "48 hours"
  },
  {
    id: "PA-004",
    patientRisk: "Medium",
    payer: "Commercial",
    service: "CT abdomen",
    status: "Escalated",
    tier: "Tier 1",
    age: 8,
    documentation: "Complete",
    missingItem: "None",
    owner: "Revenue Cycle Lead",
    nextAction: "Escalate to payer supervisor",
    defectSource: "Payer delay",
    escalation: "Now"
  },
  {
    id: "PA-005",
    patientRisk: "Low",
    payer: "BCBS TN",
    service: "Physical therapy extension",
    status: "Approved",
    tier: "Tier 3",
    age: 2,
    documentation: "Complete",
    missingItem: "None",
    owner: "Prior Auth Coordinator",
    nextAction: "Notify scheduling",
    defectSource: "Resolved",
    escalation: "None"
  }
];

const tabs = ["Overview", "Auth Log", "Queue", "Documentation", "Escalations", "Payer Rules"];

function moneylessNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function PriorAuthTracker() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [payerFilter, setPayerFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRequests = useMemo(() => {
    return authRequests.filter((item) => {
      const payerMatch = payerFilter === "All" || item.payer === payerFilter;
      const tierMatch = tierFilter === "All" || item.tier === tierFilter;
      const statusMatch = statusFilter === "All" || item.status === statusFilter;
      return payerMatch && tierMatch && statusMatch;
    });
  }, [payerFilter, tierFilter, statusFilter]);

  const openRequests = authRequests.filter((item) => item.status !== "Approved").length;
  const averageAge = Math.round(authRequests.reduce((sum, item) => sum + item.age, 0) / authRequests.length);
  const overFiveDays = authRequests.filter((item) => item.age > 5).length;
  const missingDocumentation = authRequests.filter((item) => item.documentation === "Incomplete").length;
  const escalationNeeded = authRequests.filter((item) => ["Today", "Now"].includes(item.escalation)).length;
  const patientAccessRisk = authRequests.filter((item) => item.patientRisk === "High").length;
  const denialRisk = authRequests.filter((item) => item.status === "Missing documentation" || item.age > 5).length;
  const followUpBacklog = authRequests.filter((item) => item.defectSource.includes("Payer")).length;

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGrid}>
          <div>
            <p style={styles.eyebrow}>Kori Pickle healthcare operations portfolio</p>
            <h1 style={styles.headline}>Prior Authorization Workflow Tracker</h1>
            <p style={styles.subhead}>
              A simulated operational tracker for authorization aging, documentation readiness, payer follow-up, escalation ownership, and patient access risk.
            </p>
          </div>
          <WorkflowMark />
        </div>
      </section>

      <nav style={styles.tabs}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? styles.activeTab : styles.tab}>
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Overview" && (
        <section style={styles.overviewGrid}>
          <Kpi label="Open auth requests" value={openRequests} />
          <Kpi label="Average auth age" value={`${averageAge} days`} />
          <Kpi label="Requests over 5 days" value={overFiveDays} />
          <Kpi label="Missing documentation" value={missingDocumentation} />
          <Kpi label="Escalations needed" value={escalationNeeded} />
          <Kpi label="Patient access risk" value={patientAccessRisk} />
          <Kpi label="Authorization denial risk" value={denialRisk} />
          <Kpi label="Payer follow-up backlog" value={followUpBacklog} />
        </section>
      )}

      {activeTab === "Auth Log" && (
        <section style={styles.panel}>
          <SectionHeader title="Authorization log" body="Filter simulated authorization requests by payer, tier, and status." />
          <div style={styles.filters}>
            <Select value={payerFilter} onChange={setPayerFilter} options={["All", "BCBS TN", "TennCare MCO", "Medicare Advantage", "Commercial"]} />
            <Select value={tierFilter} onChange={setTierFilter} options={["All", "Tier 1", "Tier 2", "Tier 3"]} />
            <Select value={statusFilter} onChange={setStatusFilter} options={["All", "Pending payer review", "Missing documentation", "Submitted", "Escalated", "Approved"]} />
          </div>
          <DataTable rows={filteredRequests} />
        </section>
      )}

      {activeTab === "Queue" && (
        <section style={styles.queueGrid}>
          {["Tier 1", "Tier 2", "Tier 3"].map((tier) => (
            <div key={tier} style={styles.panel}>
              <SectionHeader title={tier} body="Prioritized by patient access risk, age, payer delay, and documentation readiness." />
              {authRequests.filter((item) => item.tier === tier).map((item) => (
                <div key={item.id} style={styles.queueCard}>
                  <p style={styles.cardId}>{item.id}</p>
                  <h3 style={styles.cardTitle}>{item.service}</h3>
                  <p style={styles.cardMeta}>{item.payer} · {item.age} days · {item.patientRisk} risk</p>
                  <p style={styles.owner}>Owner: {item.owner}</p>
                  <p style={styles.nextAction}>Next action: {item.nextAction}</p>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}

      {activeTab === "Documentation" && (
        <section style={styles.panel}>
          <SectionHeader title="Documentation readiness" body="Tracks whether the authorization has the documentation needed before payer review." />
          <div style={styles.nodeGrid}>
            <Node title="Clinical note" status="Required" />
            <Node title="Medical necessity" status="Required" />
            <Node title="Service details" status="Required" />
            <Node title="Payer rule check" status="Required" />
          </div>
        </section>
      )}

      {activeTab === "Escalations" && (
        <section style={styles.panel}>
          <SectionHeader title="Escalation tracker" body="Shows which requests need action today and who owns the next step." />
          {authRequests.filter((item) => ["Today", "Now"].includes(item.escalation)).map((item) => (
            <div key={item.id} style={styles.escalationRow}>
              <span style={styles.orangeDot} />
              <div>
                <strong>{item.id}: {item.service}</strong>
                <p style={styles.cardMeta}>{item.owner} · {item.nextAction}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {activeTab === "Payer Rules" && (
        <section style={styles.panel}>
          <SectionHeader title="Payer rules guide" body="A simulated guide for payer-specific authorization requirements and follow-up timing." />
          <div style={styles.ruleGrid}>
            <Rule payer="BCBS TN" rule="Check portal status by day 3. Escalate by day 5 when documentation is complete." />
            <Rule payer="TennCare MCO" rule="Confirm medical necessity language before submission. Track patient access risk daily." />
            <Rule payer="Medicare Advantage" rule="Review service-specific documentation before submission and monitor aging queues." />
            <Rule payer="Commercial" rule="Use payer-specific forms and confirm receipt within 48 hours." />
          </div>
        </section>
      )}

      <footer style={styles.footer}>
        <p style={styles.createdBy}>Created by Kori Pickle</p>
        <p style={styles.signature}>Kori Pickle</p>
        <div style={styles.iconRow}>
          <span style={styles.icon}>in</span>
          <span style={styles.icon}>GH</span>
        </div>
      </footer>
    </main>
  );
}

function WorkflowMark() {
  return (
    <div style={styles.workflowMark}>
      <div style={styles.node}>1</div>
      <div style={styles.connector} />
      <div style={styles.node}>2</div>
      <div style={styles.connectorFade} />
      <div style={styles.node}>3</div>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <article style={styles.kpiCard}>
      <p style={styles.kpiLabel}>{label}</p>
      <h2 style={styles.kpiValue}>{moneylessNumber(value)}</h2>
    </article>
  );
}

function SectionHeader({ title, body }) {
  return (
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionBody}>{body}</p>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} style={styles.select}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function DataTable({ rows }) {
  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Payer</th>
            <th style={styles.th}>Service</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Tier</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Owner</th>
            <th style={styles.th}>Next action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td style={styles.tdStrong}>{item.id}</td>
              <td style={styles.td}>{item.payer}</td>
              <td style={styles.td}>{item.service}</td>
              <td style={styles.td}>{item.status}</td>
              <td style={styles.td}>{item.tier}</td>
              <td style={styles.td}>{item.age} days</td>
              <td style={styles.td}>{item.owner}</td>
              <td style={styles.td}>{item.nextAction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Node({ title, status }) {
  return (
    <div style={styles.nodeCard}>
      <div style={styles.doubleRing} />
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardMeta}>{status}</p>
    </div>
  );
}

function Rule({ payer, rule }) {
  return (
    <div style={styles.ruleCard}>
      <h3 style={styles.cardTitle}>{payer}</h3>
      <p style={styles.cardMeta}>{rule}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: BRAND.white,
    color: BRAND.black,
    padding: "36px",
    fontFamily: "Inter, Arial, sans-serif"
  },
  hero: {
    border: `1px solid ${BRAND.warmGray}`,
    borderRadius: "28px",
    padding: "38px",
    background: `linear-gradient(135deg, ${BRAND.white} 0%, ${BRAND.softGray} 100%)`,
    marginBottom: "24px"
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(240px, 0.6fr)",
    gap: "30px",
    alignItems: "center"
  },
  eyebrow: {
    color: BRAND.orange,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 800,
    fontSize: "12px",
    margin: 0
  },
  headline: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(40px, 7vw, 76px)",
    lineHeight: 0.92,
    margin: "16px 0",
    color: BRAND.black
  },
  subhead: {
    fontSize: "18px",
    lineHeight: 1.7,
    color: BRAND.textGray,
    maxWidth: "760px"
  },
  workflowMark: {
    minHeight: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px"
  },
  node: {
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    border: `2px solid ${BRAND.orange}`,
    outline: `7px solid rgba(255, 130, 0, 0.14)`,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    background: BRAND.white,
    boxShadow: "0 0 24px rgba(255, 130, 0, 0.25)"
  },
  connector: {
    width: "64px",
    borderTop: `2px dotted ${BRAND.orange}`
  },
  connectorFade: {
    width: "64px",
    borderTop: `2px dotted ${BRAND.warmGray}`
  },
  tabs: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "24px"
  },
  tab: {
    border: `1px solid ${BRAND.warmGray}`,
    background: BRAND.white,
    color: BRAND.textGray,
    padding: "12px 16px",
    borderRadius: "999px",
    fontWeight: 800,
    cursor: "pointer"
  },
  activeTab: {
    border: `1px solid ${BRAND.orange}`,
    background: BRAND.orange,
    color: BRAND.black,
    padding: "12px 16px",
    borderRadius: "999px",
    fontWeight: 900,
    cursor: "pointer"
  },
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px"
  },
  kpiCard: {
    background: BRAND.white,
    border: `1px solid ${BRAND.warmGray}`,
    borderTop: `6px solid ${BRAND.orange}`,
    borderRadius: "22px",
    padding: "22px",
    minHeight: "130px",
    boxShadow: "0 14px 34px rgba(0, 0, 0, 0.06)"
  },
  kpiLabel: {
    color: BRAND.textGray,
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: 0,
    fontWeight: 800
  },
  kpiValue: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "38px",
    margin: "18px 0 0"
  },
  panel: {
    background: BRAND.white,
    border: `1px solid ${BRAND.warmGray}`,
    borderRadius: "24px",
    padding: "26px",
    boxShadow: "0 14px 34px rgba(0, 0, 0, 0.05)"
  },
  sectionHeader: {
    marginBottom: "20px"
  },
  sectionTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "34px",
    margin: 0
  },
  sectionBody: {
    color: BRAND.textGray,
    lineHeight: 1.7,
    maxWidth: "740px"
  },
  filters: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "18px"
  },
  select: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: `1px solid ${BRAND.warmGray}`,
    background: BRAND.white,
    color: BRAND.black,
    fontWeight: 700
  },
  tableWrap: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "960px"
  },
  th: {
    textAlign: "left",
    padding: "14px",
    borderBottom: `3px solid ${BRAND.orange}`,
    background: BRAND.black,
    color: BRAND.white
  },
  td: {
    padding: "14px",
    borderBottom: `1px solid ${BRAND.warmGray}`,
    color: BRAND.textGray
  },
  tdStrong: {
    padding: "14px",
    borderBottom: `1px solid ${BRAND.warmGray}`,
    color: BRAND.black,
    fontWeight: 900
  },
  queueGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px"
  },
  queueCard: {
    border: `1px solid ${BRAND.warmGray}`,
    borderRadius: "20px",
    padding: "18px",
    marginBottom: "14px",
    background: BRAND.softGray
  },
  cardId: {
    color: BRAND.orange,
    fontWeight: 900,
    margin: 0
  },
  cardTitle: {
    color: BRAND.black,
    marginBottom: "6px"
  },
  cardMeta: {
    color: BRAND.textGray,
    lineHeight: 1.6
  },
  owner: {
    color: BRAND.black,
    fontWeight: 800
  },
  nextAction: {
    color: BRAND.textGray
  },
  nodeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px"
  },
  nodeCard: {
    padding: "22px",
    border: `1px solid ${BRAND.warmGray}`,
    borderRadius: "24px",
    background: BRAND.softGray
  },
  doubleRing: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: `2px solid ${BRAND.orange}`,
    outline: `6px solid rgba(255, 130, 0, 0.14)`,
    boxShadow: "0 0 22px rgba(255, 130, 0, 0.18)",
    background: BRAND.white
  },
  escalationRow: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    padding: "16px 0",
    borderBottom: `1px solid ${BRAND.warmGray}`
  },
  orangeDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: BRAND.orange,
    marginTop: "4px",
    boxShadow: "0 0 18px rgba(255, 130, 0, 0.35)"
  },
  ruleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px"
  },
  ruleCard: {
    padding: "20px",
    borderRadius: "22px",
    border: `1px solid ${BRAND.warmGray}`,
    background: BRAND.softGray
  },
  footer: {
    textAlign: "center",
    padding: "54px 0 20px",
    color: BRAND.ink
  },
  createdBy: {
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: BRAND.textGray,
    marginBottom: "6px"
  },
  signature: {
    fontFamily: "Brush Script MT, Segoe Script, cursive",
    fontSize: "42px",
    fontStyle: "italic",
    transform: "skewX(-6deg)",
    margin: "0 0 12px",
    color: BRAND.ink
  },
  iconRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px"
  },
  icon: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: `1px solid ${BRAND.warmGray}`,
    display: "grid",
    placeItems: "center",
    fontSize: "12px",
    fontWeight: 900,
    color: BRAND.black
  }
};

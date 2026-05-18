# Google Sheets structure guide

Workbook name:

Prior Authorization Workflow Tracker

## Tab 1: DASHBOARD

Purpose:

Executive summary of prior authorization workload, aging, payer delay, documentation readiness, escalation ownership, and patient access risk.

Suggested KPI cards:

1. Open auth requests
2. Average auth age
3. Requests over 5 days
4. Missing documentation count
5. Escalations needed
6. Patient access risk count
7. Authorization denial risk
8. Payer follow-up backlog

Suggested sections:

- KPI summary
- payer breakdown
- queue by tier
- documentation readiness summary
- escalation summary
- patient access risk summary

## Tab 2: AUTH_LOG

Column headers in order:

1. Auth ID
2. Request Date
3. Scheduled Service Date
4. Payer
5. Patient Access Risk
6. Service Type
7. Authorization Status
8. Tier
9. Days Aged
10. Documentation Readiness
11. Missing Item
12. Current Owner
13. Next Action
14. Payer Follow-Up Date
15. Defect Source
16. Escalation Needed
17. Escalation Owner
18. Notes

## Tab 3: PAYER_RULES

Column headers in order:

1. Payer
2. Service Category
3. Authorization Required
4. Documentation Required
5. Submission Method
6. Follow-Up Timing
7. Escalation Timing
8. Common Defect
9. Internal Owner
10. Notes

## Tab 4: QUEUE_VIEW

Column headers in order:

1. Tier
2. Auth ID
3. Payer
4. Service Type
5. Days Aged
6. Patient Access Risk
7. Current Owner
8. Next Action
9. Escalation Needed
10. Defect Source

## Tab 5: ESCALATION_TRACKER

Column headers in order:

1. Auth ID
2. Payer
3. Service Type
4. Escalation Reason
5. Escalation Owner
6. Escalation Date
7. Required Action
8. Status
9. Follow-Up Date
10. Outcome

## Tab 6: DOCUMENTATION_READINESS

Column headers in order:

1. Auth ID
2. Clinical Note Present
3. Medical Necessity Present
4. Order Details Complete
5. Diagnosis Support Present
6. Payer Form Complete
7. Attachment Complete
8. Readiness Status
9. Missing Item
10. Correction Owner
11. Notes

## Tab 7: Lists

Dropdown values:

Payer:

- BCBS TN
- TennCare MCO
- Medicare Advantage
- Commercial

Authorization Status:

- Not started
- Submitted
- Pending payer review
- Missing documentation
- Escalated
- Approved
- Denied
- Closed

Tier:

- Tier 1
- Tier 2
- Tier 3

Patient Access Risk:

- High
- Medium
- Low

Documentation Readiness:

- Ready
- Needs review
- Incomplete
- Blocked

Escalation Needed:

- Now
- Today
- 48 hours
- None

Defect Source:

- Intake
- Documentation readiness
- Authorization queue
- Payer delay
- Payer rule mismatch
- Scheduling handoff
- Resolved

## Suggested formulas

Open auth requests:

=COUNTIF(AUTH_LOG!G:G,"<>Approved")

Average auth age:

=AVERAGE(AUTH_LOG!I:I)

Requests over 5 days:

=COUNTIF(AUTH_LOG!I:I,">5")

Missing documentation count:

=COUNTIF(AUTH_LOG!J:J,"Incomplete")

Escalations needed:

=COUNTIF(AUTH_LOG!P:P,"Now")+COUNTIF(AUTH_LOG!P:P,"Today")

Patient access risk count:

=COUNTIF(AUTH_LOG!E:E,"High")

Authorization denial risk:

=COUNTIFS(AUTH_LOG!J:J,"Incomplete")+COUNTIF(AUTH_LOG!I:I,">5")

Payer follow-up backlog:

=COUNTIF(AUTH_LOG!O:O,"Payer delay")

## Conditional formatting

Use Tennessee Orange for:

- Tier 1
- Now
- Today
- High patient access risk
- Incomplete documentation
- Requests over 5 days

Use warm gray for:

- closed items
- approved requests
- resolved defects

Use black text on white background for readability.
# KPI definitions

## Open auth requests

Formula:

Count of authorization requests where status is not approved or closed.

Target:

Declining open queue with clear ownership.

Escalation threshold:

More than 10 open requests without next action ownership.

Operational meaning:

Shows active prior authorization workload.

## Average auth age

Formula:

Average number of days between request date and current date for open authorization requests.

Target:

Below 5 days.

Escalation threshold:

Above 7 days for high-risk services.

Operational meaning:

Shows whether authorizations are moving or stalling.

## Requests over 5 days

Formula:

Count of open authorization requests older than 5 days.

Target:

0 high-risk requests over 5 days.

Escalation threshold:

Any high-risk request over 5 days.

Operational meaning:

Shows where patient access risk may increase.

## Missing documentation count

Formula:

Count of requests marked incomplete in documentation readiness.

Target:

0 submitted requests missing required documentation.

Escalation threshold:

Any missing documentation attached to a scheduled service.

Operational meaning:

Shows upstream documentation gaps before payer review.

## Escalations needed

Formula:

Count of requests where escalation status is Today or Now.

Target:

All escalations have assigned owners and next actions.

Escalation threshold:

Any escalation without current owner.

Operational meaning:

Shows which authorizations need immediate operational action.

## Patient access risk count

Formula:

Count of requests marked High patient access risk.

Target:

0 high-risk requests without documented next action.

Escalation threshold:

Any high-risk request with missing documentation, payer delay, or no owner.

Operational meaning:

Shows authorizations that may delay care.

## Authorization denial risk

Formula:

Count of authorization requests with missing documentation, payer-specific rule mismatch, or age above threshold.

Target:

Declining risk count week over week.

Escalation threshold:

Any high-risk service with more than 1 unresolved defect.

Operational meaning:

Shows where authorization problems may become denials.

## Payer follow-up backlog

Formula:

Count of requests needing payer follow-up.

Target:

All payer follow-ups completed within 48 hours.

Escalation threshold:

Any payer follow-up older than 3 business days.

Operational meaning:

Shows payer-side delays that require tracking, documentation, and ownership.

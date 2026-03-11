---
name: order-troubleshooting
description: Diagnose and resolve common order issues such as delayed shipments, wrong or incorrect items, stuck or pending orders, payment failures, or packages not received. Use when a customer reports a shipping problem or any issue with their order.
metadata:
  author: acme-commerce
  version: "1.0"
---

# Order Troubleshooting

Use this structured workflow to diagnose order issues.

## Step 1: Gather information

1. Retrieve the order using `get_order`.
2. Retrieve the customer record using `get_customer` to check for account-level issues.
3. Note the current order status and last update timestamp.

## Step 2: Classify and resolve

Based on the order status, read the appropriate resolution guide:

| Order status | Issue type | Resolution guide |
|---|---|---|
| `shipped` + delivery date passed | Delayed shipment | [shipping-issues.md](references/shipping-issues.md) |
| `delivered` + wrong items | Incorrect items | [return-process.md](references/return-process.md) |
| `pending` or `processing` for 24h+ | Stuck order | [stuck-orders.md](references/stuck-orders.md) |
| `payment_failed` | Payment failure | [payment-issues.md](references/payment-issues.md) |

Read the relevant guide and follow its resolution steps.

## Step 3: Take action

1. Apply the resolution from the guide.
2. Update the order status using `update_order_status` if needed.
3. Check [escalation rules](references/escalation-rules.md) to determine if the case requires supervisor involvement.
4. Summarize the diagnosis and action taken for the support agent.

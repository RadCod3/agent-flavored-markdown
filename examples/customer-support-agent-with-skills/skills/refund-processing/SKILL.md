---
name: refund-processing
description: Process customer refund requests following company policy. Use when a customer requests a refund, return, exchange, money back, or store credit for an order.
metadata:
  author: acme-commerce
  version: "1.0"
---

# Refund Processing

Follow these steps when processing a refund request.

## Step 1: Verify eligibility

1. Retrieve the order using `get_order` with the order ID.
2. Read [refund policy](references/refund-policy.md) to determine eligibility based on the order's delivery date and item condition.
3. Check if any items fall under non-refundable categories listed in the policy.

## Step 2: Calculate refund amount

1. Read [refund calculations](references/refund-calculations.md) for the formulas and rules for full refunds, partial refunds, and defective item refunds.
2. Apply the correct calculation based on the eligibility determined in Step 1.

## Step 3: Process the refund

1. Call `create_refund` with the order ID, refund amount, and reason.
2. Call `update_order_status` to set the order status to `refund_pending`.
3. Read [refund policy](references/refund-policy.md) for the expected processing timeline by payment method.
4. Summarize the refund to the support agent: order ID, refund amount, method, and expected timeline.
5. If the support agent asks for a customer email draft, use the [refund email template](assets/refund-email-template.txt) and fill in the placeholders.

## Edge cases

For gift orders, subscriptions, or multiple-item refunds, consult [refund policy](references/refund-policy.md) for the specific rules before proceeding.

# Stuck Orders

## Diagnosis

An order is considered stuck if its status is `pending` or `processing` for more than 24 hours.

Common causes:
- **Payment authorization failure**: the payment was initiated but not confirmed by the processor.
- **Inventory hold**: one or more items are out of stock or reserved for another order.
- **Fraud review**: the order was flagged by the automated fraud detection system.

## Resolution by cause

### Payment authorization failure
1. Inform the customer that payment did not go through.
2. Ask them to update their payment method or retry with a different card.
3. Do not disclose specific decline reasons from the payment processor.

### Inventory hold
1. Check if the item is back-ordered and provide an ETA if available.
2. If no ETA, offer alternatives: substitute product, store credit, or cancellation with full refund.
3. Update the order status to `backordered` if applicable.

### Fraud review
1. **Do not disclose to the customer** that the order is under fraud review.
2. Inform the customer that the order is "under review" and will be processed shortly.
3. Escalate to the fraud team internally for manual review.
4. If the customer presses for details, say it is a "routine verification" that may take up to 48 hours.

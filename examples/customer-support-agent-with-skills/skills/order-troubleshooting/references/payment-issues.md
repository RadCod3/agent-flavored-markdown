# Payment Issues

## Diagnosis

An order with `payment_failed` status means the payment was declined or could not be processed.

Common causes:
- Insufficient funds
- Expired card
- Bank-side fraud block
- Incorrect billing address

## Resolution

1. Verify the payment method on file using `get_customer`.
2. Ask the customer to:
   - Retry with the same payment method (in case it was a temporary bank-side issue).
   - Try a different payment method.
   - Contact their bank if the issue persists — the bank may have flagged the transaction.
3. Do **not** disclose specific decline codes or processor error messages to the customer.
4. If the customer successfully retries, the order will move to `processing` automatically.

## Repeat payment failures

If the customer has experienced multiple payment failures:
- Suggest using a different payment method entirely.
- Check if the customer's account has any holds or restrictions.
- Escalate per the escalation rules if this is part of a pattern of account issues.

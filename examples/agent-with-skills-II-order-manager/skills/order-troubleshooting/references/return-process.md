# Return Process

## Initiating a return

1. Create a return request in the order system using `update_order_status` with status `return_initiated`.
2. Generate a prepaid shipping label (handled automatically by the fulfillment system).
3. Provide the customer with the return shipping label and instructions.

## Return shipping

- Domestic returns: prepaid USPS label, 14-day return window from label generation.
- International returns: customer pays return shipping unless the error was on our side.

## Inspection and processing

Once the return is received at the warehouse:
- Items are inspected within 2 business days.
- If approved, the refund or exchange is processed (see refund-processing skill for refund details).
- If the item fails inspection (damage not reported, used beyond reasonable trial), the return is denied and the item is shipped back to the customer.

## Exchanges

For exchanges:
- The replacement item ships as soon as the return is received and inspected.
- If the replacement item is a different price, the difference is charged or refunded.
- Out-of-stock replacements: offer store credit or refund instead.

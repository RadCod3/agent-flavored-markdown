# Order Management Agent — Sample

A sample AFM agent that demonstrates [Agent Skills](https://agentskills.io) integration. The agent acts as a customer service assistant for an e-commerce platform, using MCP tools to manage orders and skills to follow structured workflows.

## Structure

```
agent-with-skills-II-order-manager/
├── order_management_agent.afm.md       # Agent definition
├── demo-order-mcp-services/
│   ├── ballerina/                      # Ballerina MCP server
│   │   ├── Ballerina.toml
│   │   ├── Config.toml
│   │   └── main.bal
│   └── python/                         # Python MCP server
│       ├── server.py
│       └── requirements.txt
└── skills/
    ├── refund-processing/
    │   ├── SKILL.md                    # Refund workflow (lean — delegates to references)
    │   ├── references/
    │   │   ├── refund-policy.md        # Eligibility windows, non-refundable items, timelines
    │   │   └── refund-calculations.md  # Formulas for full, partial, and defective refunds
    │   └── assets/
    │       └── refund-email-template.txt
    └── order-troubleshooting/
        ├── SKILL.md                    # Diagnosis workflow (classifies, then delegates to references)
        └── references/
            ├── shipping-issues.md      # Delayed shipment diagnosis and resolution
            ├── stuck-orders.md         # Pending/processing orders: payment, inventory, fraud
            ├── payment-issues.md       # Payment failure resolution
            ├── return-process.md       # Return initiation, shipping, inspection, exchanges
            └── escalation-rules.md     # When and how to escalate to a supervisor
```

## How skills are used

The agent follows the [progressive disclosure](https://agentskills.io/specification#progressive-disclosure) model:

1. **Startup** — the agent loads only skill names and descriptions into its context (~100 tokens per skill).
2. **Activation** — when a task matches a skill, the agent loads the full `SKILL.md` body. The body contains a high-level workflow that references supporting files.
3. **Resource loading** — as the workflow directs, the agent reads specific files from `references/` or `assets/` on demand.

This keeps the agent's context small while giving it access to detailed policy and process documentation only when needed.

## Demo MCP services

The `demo-order-mcp-services/` directory contains two equivalent MCP server implementations that serve the same mock order and customer data. Pick whichever fits your stack — they expose the same tools and use the same test data.

### Ballerina

```bash
cd demo-order-mcp-services/ballerina
bal run
```

Starts an MCP server on port 9090 at `/mcp`. Uses basic authentication (credentials in `Config.toml` — these are for local development only, never commit real credentials to source control).

### Python

```bash
cd demo-order-mcp-services/python
pip install -r requirements.txt
python server.py
```

Starts an MCP server on port 9090 at `/mcp`. Uses the same basic authentication credentials (defaults to `orderagent`/`pw1234`, configurable via `ORDER_SERVICE_USERNAME` and `ORDER_SERVICE_PASSWORD` environment variables).

## MCP tools available

The demo MCP server exposes five tools:

| Tool | Description |
|---|---|
| `get_order(orderId)` | Retrieve order details |
| `list_orders(customerId?, status?)` | List orders with optional filters |
| `update_order_status(orderId, status)` | Update an order's status |
| `create_refund(orderId, amount, reason)` | Issue a refund |
| `get_customer(customerId)` | Retrieve customer details |

## Agent configuration notes

The agent definition sets `max_iterations: 10`, which caps the number of tool-call cycles per request. This prevents runaway loops — for example, if the agent keeps retrying a failing tool call. Adjust this based on the complexity of your workflows.

## Test scenarios

### 1. Defective item refund

**Prompt:** "Customer wants a refund for order ORD-1001. They say the headphones are defective."

| Step | Action |
|---|---|
| Skill activation | Load **refund-processing** |
| Gather data | `get_order("ORD-1001")` → `get_customer("CUST-501")` |
| Check eligibility | Read `references/refund-policy.md` — defective items have no time limit |
| Calculate refund | Read `references/refund-calculations.md` — price + tax + shipping = $92.38 |
| Confirm with agent | Present summary, wait for approval |
| Process | `create_refund("ORD-1001", 92.38, "defective")` → `update_order_status("ORD-1001", "refund_pending")` |

### 2. Stuck order

**Prompt:** "Order ORD-1003 has been stuck in pending for days. Customer Alice is asking what's going on."

| Step | Action |
|---|---|
| Skill activation | Load **order-troubleshooting** |
| Gather data | `get_order("ORD-1003")` → `get_customer("CUST-501")` |
| Classify | Status is `pending` → stuck order |
| Resolve | Read `references/stuck-orders.md` — diagnose cause (payment, inventory, or fraud) |
| Check escalation | Read `references/escalation-rules.md` — no triggers (value < $500, 1 issue in 30 days) |

### 3. Payment failure with escalation

**Prompt:** "Customer Carol Davis says she can't complete her order ORD-1004. What's wrong?"

| Step | Action |
|---|---|
| Skill activation | Load **order-troubleshooting** |
| Gather data | `get_order("ORD-1004")` → `get_customer("CUST-503")` |
| Classify | Status is `payment_failed` |
| Resolve | Read `references/payment-issues.md` — advise retry or contact bank |
| Check escalation | Read `references/escalation-rules.md` — **escalate**: order > $500, customer has 4 issues in 30 days |

### 4. Incorrect items

**Prompt:** "Customer Bob says he got the wrong item in order ORD-1002."

| Step | Action |
|---|---|
| Skill activation | Load **order-troubleshooting** |
| Gather data | `get_order("ORD-1002")` → `get_customer("CUST-502")` |
| Classify | Delivered + wrong items → incorrect items |
| Resolve | Read `references/return-process.md` — initiate return, ship correct item |
| Process | `update_order_status("ORD-1002", "return_initiated")` |
| Check escalation | Read `references/escalation-rules.md` — no triggers |

### 5. Partial refund (store credit)

**Prompt:** "Customer Alice wants a refund for the USB-C cables from order ORD-1001. She ordered them 50 days ago."

| Step | Action |
|---|---|
| Skill activation | Load **refund-processing** |
| Gather data | `get_order("ORD-1001")` |
| Check eligibility | Read `references/refund-policy.md` — 31-60 days = partial refund, store credit only |
| Calculate refund | Read `references/refund-calculations.md` — 80% of $25.98 = $20.78 |
| Confirm with agent | Present summary, wait for approval |
| Process | `create_refund("ORD-1001", 20.78, "customer_request")` → `update_order_status("ORD-1001", "refund_pending")` |

### 6. Draft refund email

**Prompt:** "Draft the refund confirmation email for Alice." (after processing a refund)

| Step | Action |
|---|---|
| Resource load | Read `assets/refund-email-template.txt` — fill placeholders with order/refund details |

### 7. Non-refundable item (skill handles rejection)

**Prompt:** "Customer Bob wants a refund for order ORD-1005. He says he changed his mind about the course."

| Step | Action |
|---|---|
| Skill activation | Load **refund-processing** |
| Gather data | `get_order("ORD-1005")` → `get_customer("CUST-502")` |
| Check eligibility | Read `references/refund-policy.md` — digital downloads are non-refundable |
| Result | Inform the support agent the item is not eligible for refund, citing the non-refundable category policy |

No refund is created — the skill identifies ineligibility and stops.

### 8. General inquiry (no skill needed)

**Prompt:** "Look up all orders for customer CUST-501."

| Step | Action |
|---|---|
| Tool call | `list_orders("CUST-501")` — returns ORD-1001 and ORD-1003 |

No skill is activated — the agent uses MCP tools directly.

## Use with an AFM interpreter Docker image

```bash
docker run -v ./order_management_agent.afm.md:/app/order_management_agent.afm.md \
    -v ./skills:/app/skills \
    -e ANTHROPIC_API_KEY=<YOUR_API_KEY> \
    -e ORDER_SERVICE_USERNAME=<YOUR_ORDERS_USERNAME> \
    -e ORDER_SERVICE_PASSWORD=<YOUR_ORDERS_PASSWORD> \
    -e ORDER_MCP_URL=<YOUR_ORDERS_MCP_URL> \
    -p 8085:8085 \
    ghcr.io/wso2/afm-ballerina-interpreter:latest /app/order_management_agent.afm.md
```

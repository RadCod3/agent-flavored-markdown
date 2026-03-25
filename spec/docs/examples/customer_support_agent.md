# Customer Support Agent Example

A customer service agent with MCP tools and Agent Skills for refunds and order troubleshooting. This agent expects [these skill definitions](https://github.com/wso2/agent-flavored-markdown/tree/main/examples/customer-support-agent-with-skills/skills) at the specified skills path (e.g., `./skills`).

<div class="demo-code-container">
  <div class="demo-code">
    <div class="demo-code-header">
      <span class="demo-file-name">customer_support_agent.afm.md</span>
      <a href="https://github.com/wso2/agent-flavored-markdown/tree/main/examples/customer-support-agent-with-skills" target="_blank" class="demo-github-link" title="View on GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a>
    </div>
    <div class="demo-code-content">
```afm
---
spec_version: "0.3.0"
name: "CustomerSupportAgent"
description: "A customer support agent that handles e-commerce order inquiries,
  refunds, and troubleshooting."
version: "1.0.0"
author: "Acme Commerce <platform@acme.example.com>"
provider:
  name: "Acme Commerce"
  url: "https://acme.example.com"

model:
  provider: "anthropic"
  name: "claude-sonnet-4-6"
  authentication:
    type: "api-key"
    api_key: "${env:ANTHROPIC_API_KEY}"

max_iterations: 10

interfaces:
  - type: webchat
    exposure:
      http:
        path: "/orders"

tools:
  mcp:
    - name: "order_service"
      transport:
        type: "http"
        url: "${env:ORDER_MCP_URL}"
        authentication:
          type: "basic"
          username: "${env:ORDER_SERVICE_USERNAME}"
          password: "${env:ORDER_SERVICE_PASSWORD}"
      tool_filter:
        allow:
          - "get_order"
          - "update_order_status"
          - "list_orders"
          - "create_refund"
          - "get_customer"

skills:
  - type: "local"
    path: "./skills"
---

# Role

You are a customer support agent for Acme Commerce. You help support staff manage
orders, process refunds, and troubleshoot order issues using the order management
system.

# Instructions

- When a support request comes in, first retrieve the order details using the
  order_service tools.
- Identify whether the request is a general inquiry, a refund request, or a
  troubleshooting case.
- For refund requests, activate the refund-processing skill to follow the correct
  refund policy and procedures.
- For order issues (stuck, delayed, incorrect items), activate the
  order-troubleshooting skill for structured diagnosis steps.
- Always confirm actions with the support agent before making changes to an order.
- Respond with clear, structured summaries including order ID, customer name, and
  actions taken.
```
    </div>
  </div>
</div>

# Examples

Explore these example agents to see AFM in action. Each example includes an agent definition (`.afm.md` file) and a README with setup instructions and test scenarios.

| Example | Description | Labels |
|---|---|---|
| [Friendly Assistant](friendly-assistant/) | A conversational assistant exposed via a web-based chat interface. | `interface/webchat` |
| [Math Tutor](math-tutor/) | A CLI-based math tutor agent that uses MCP tools for math operations. | `interface/consolechat`, `tools/mcp/http` |
| [GitHub PR Analyzer](pull-request-analyzer/) | A webhook-triggered agent that detects drift between code and documentation. | `interface/webhook`, `tools/mcp/http` |
| [Research Assistant](research-assistant/) | A self-contained agent that fetches and summarizes web content. | `tools/mcp/stdio`, `interface/webchat` |
| [Code Explainer](code-explainer/) | A web-based agent that explores and explains code in any project directory. | `tools/mcp/stdio`, `interface/consolechat` |
| [Tech Support Agent](agent-with-skills-I-support-agent/) | A support agent that uses skills for structured troubleshooting workflows. | `skills`, `interface/consolechat` |
| [Order Management Agent](agent-with-skills-II-order-manager/) | A customer service agent with MCP tools and skills for refunds and order troubleshooting. | `skills`, `tools/mcp/http`, `interface/webchat` |
| [HR Agent with RAG](hr-agent-with-rag/) | An HR support agent that answers employee questions using RAG over company policy documents. | `RAG`, `tools/mcp/stdio`, `interface/webchat` |

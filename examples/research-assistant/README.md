# Research Assistant — Sample

An AFM agent that fetches web content, reasons through complex questions step by step, and synthesizes well-sourced answers. Give it URLs or topics and it reads pages, follows links to find primary sources, and presents clear findings with citations.

## Structure

```
research-assistant/
└── research_assistant.afm.md    # Agent definition
```

## What it demonstrates

- Web chat interface (`webchat`)
- Multiple MCP servers working together (fetch + sequential-thinking)
- stdio MCP transport with official MCP servers (no API keys required beyond the LLM)
- Deep content navigation — following links from landing pages to find detailed information
- Structured reasoning for complex, multi-part questions
- A self-contained agent that needs no local files or project directory

## Environment variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |

## Test scenarios

### 1. Summarize a page

**Prompt:** "Give me an overview of MCP (https://en.wikipedia.org/wiki/Model_Context_Protocol)"

The agent fetches the page and provides a structured summary of the key points.

### 2. Deep dive from a landing page

**Prompt:** "What transport mechanisms does MCP support? Start from https://modelcontextprotocol.io/docs"

The agent should fetch the docs landing page, identify links to the transport/architecture sections, follow them, and return a detailed answer with citations — not just summarize the landing page.

### 3. Compare sources

**Prompt:** "Compare these two markup languages: https://en.wikipedia.org/wiki/Markdown and https://en.wikipedia.org/wiki/AsciiDoc"

The agent fetches both pages, uses sequential thinking to identify comparison dimensions, and highlights the differences in syntax, features, and typical use cases.

### 4. Reason through a complex question

**Prompt:** "Based on https://en.wikipedia.org/wiki/Model_Context_Protocol, what problem does MCP solve and why was a new protocol needed instead of extending existing ones?"

The agent should fetch the page, use sequential thinking to reason through the motivation and design decisions, and present a well-structured explanation.

### 5. Navigate and extract specific information

**Prompt:** "What are the interface types defined in the Agent-Flavored Markdown specification? (https://wso2.github.io/agent-flavored-markdown/)"

The agent should fetch the landing page, find the link to the specification, navigate to it, and extract the supported interface types. This tests the agent's ability to navigate from a starting page to find specific information.

## Use with an AFM interpreter Docker image

```bash
docker run -v ./research_assistant.afm.md:/app/research_assistant.afm.md \
    -e ANTHROPIC_API_KEY=<YOUR_API_KEY> \
    -p 8085:8085 \
    ghcr.io/wso2/afm-langchain-interpreter:latest run /app/research_assistant.afm.md
```

Then open [`http://localhost:8085/chat/ui`](http://localhost:8085/chat/ui).

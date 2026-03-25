# HR Agent — Sample

An AFM agent that acts as an internal HR support assistant for a fictional telecommunications company (ConnectWave), using Retrieval-Augmented Generation (RAG) to answer employee questions grounded in company policy documents.

> **Note:** This sample assumes RAG ingestion has already happened for relevant documents.

## Structure

```
hr-agent-with-rag/
└── hr_agent.afm.md    # Agent definition
```

## What it demonstrates

- Web chat interface (`webchat`)
- RAG-based question answering using a vector database (Pinecone) via an MCP server
- stdio MCP transport with a Python-based MCP server (`rag-retrieval-mcp`)
- Detailed response guidelines with structured escalation rules
- Edge case handling via a decision table
- Safety and privacy guardrails for sensitive HR data

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key (used for both the LLM and the embedding model) |
| `PINECONE_API_KEY` | Pinecone API key for the vector database |
| `PINECONE_SERVICE_URL` | Pinecone index host URL |

## MCP tools

| Server | Tool | Description |
|---|---|---|
| `hr_policy_rag_retrieval` | `retrieve` | Searches ConnectWave company policy documents and returns relevant text chunks |

## Test scenarios

### 1. Simple policy question

**Prompt:** "How many PTO days do I get per year?"

The agent retrieves the leave policy and presents the PTO accrual schedule, asking for tenure details to give a specific answer.

### 2. Multi-topic question

**Prompt:** "What happens to my PTO if I resign?"

The agent retrieves content for both PTO payout and resignation final pay, combining the results into a complete answer.

### 3. Escalation scenario

**Prompt:** "I think there's a discrepancy in my last paycheck."

The agent does not attempt to resolve the issue directly. Instead, it escalates by directing the employee to the HR department.

### 4. Out-of-scope question

**Prompt:** "What's the weather like today?"

The agent clarifies its scope as an HR assistant and offers to help with HR-related questions.

## Use with an AFM interpreter Docker image

```bash
docker run -v ./hr_agent.afm.md:/app/hr_agent.afm.md \
    -e OPENAI_API_KEY=<YOUR_OPENAI_API_KEY> \
    -e PINECONE_API_KEY=<YOUR_PINECONE_API_KEY> \
    -e PINECONE_SERVICE_URL=<YOUR_PINECONE_HOST_URL> \
    -p 8085:8085 \
    ghcr.io/wso2/afm-langchain-interpreter:latest run /app/hr_agent.afm.md
```

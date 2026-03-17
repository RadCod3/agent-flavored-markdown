# Math Tutor — Sample

An AFM agent that acts as a math tutor, using an MCP server for math operations. It is exposed via a CLI-based console chat interface.

## Structure

```
math-tutor/
├── math_tutor.afm.md               # Agent definition
└── demo-math-mcp-services/
    ├── ballerina/                  # Ballerina MCP server
    │   ├── Ballerina.toml
    │   └── main.bal
    └── python/                     # Python MCP server
        ├── server.py
        └── requirements.txt
```

## What it demonstrates

- Console chat interface (`consolechat`)
- MCP tool integration over HTTP
- Model configuration with environment-based API key and MCP server URL

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `MATH_MCP_SERVER` | URL of the math operations MCP server |

## Demo MCP services

The `demo-math-mcp-services/` directory contains two equivalent MCP server implementations that expose the same math operation tools. Pick whichever fits your stack.

### Ballerina

```bash
cd demo-math-mcp-services/ballerina
bal run
```

Starts an MCP server on port 9090 at `/mcp`.

### Python

```bash
cd demo-math-mcp-services/python
pip install -r requirements.txt
python server.py
```

Starts an MCP server on port 9090 at `/mcp`.

## MCP tools available

The demo MCP server exposes four tools:

| Tool | Description |
|---|---|
| `add(a, b)` | Add two numbers |
| `subtract(a, b)` | Subtract one number from another |
| `multiply(a, b)` | Multiply two numbers |
| `divide(a, b)` | Divide one number by another |

## Test scenarios

### 1. Arithmetic with tools

**Prompt:** "What is 1456 * 37 + 892 / 4?"

The agent breaks the expression into steps, calling `multiply` and `divide`, then `add` to compute the result.

### 2. Word problem with calculations

**Prompt:** "A recipe serves 4 people and needs 2.5 cups of flour. How much flour do I need for 15 people?"

The agent uses `divide` to find flour per person, then `multiply` to scale up, explaining each step.

## Use with an AFM interpreter Docker image

```bash
docker run -it -v ./math_tutor.afm.md:/app/math_tutor.afm.md \
    -e OPENAI_API_KEY=<YOUR_API_KEY> \
    -e MATH_MCP_SERVER=<YOUR_MCP_SERVER_URL> \
    -p 8085:8085 \
    ghcr.io/wso2/afm-ballerina-interpreter:latest /app/math_tutor.afm.md
```

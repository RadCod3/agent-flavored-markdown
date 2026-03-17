# Demo Math MCP Services

Mock MCP server for the math tutor agent. Two equivalent implementations are provided — pick whichever fits your stack.

## Ballerina

```bash
cd ballerina
bal run
```

Starts an MCP server on port 9090 at `/mcp`.

## Python

```bash
cd python
pip install -r requirements.txt
python server.py
```

Or with [uv](https://docs.astral.sh/uv/):

```bash
cd python
uv run --with-requirements requirements.txt server.py
```

Starts an MCP server on port 9090 at `/mcp`.

## Tools

| Tool | Description |
|---|---|
| `add(a, b)` | Add two numbers |
| `subtract(a, b)` | Subtract one number from another |
| `multiply(a, b)` | Multiply two numbers |
| `divide(a, b)` | Divide one number by another |

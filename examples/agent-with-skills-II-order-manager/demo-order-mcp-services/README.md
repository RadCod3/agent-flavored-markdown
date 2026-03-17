# Demo Order MCP Services

Mock MCP server for the order management agent. Two equivalent implementations are provided — pick whichever fits your stack.

## Ballerina

```bash
cd ballerina
bal run
```

Starts an MCP server on port 9090 at `/mcp`. Uses basic authentication (credentials in `Config.toml` — these are for local development only, never commit real credentials to source control).

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

Starts an MCP server on port 9090 at `/mcp`. Uses the same basic authentication credentials (defaults to `orderagent`/`pw1234`, configurable via `ORDER_SERVICE_USERNAME` and `ORDER_SERVICE_PASSWORD` environment variables).

## Tools

| Tool | Description |
|---|---|
| `get_order(orderId)` | Retrieve order details |
| `list_orders(customerId?, status?)` | List orders with optional filters |
| `update_order_status(orderId, status)` | Update an order's status |
| `create_refund(orderId, amount, reason)` | Issue a refund |
| `get_customer(customerId)` | Retrieve customer details |

# Demo Order MCP Services

Mock MCP server for the customer support agent. Two equivalent implementations are provided — pick whichever fits your stack. Both expose the same tools and mock data.

## Ballerina

```bash
cd ballerina
bal run
```

Starts an MCP server on port 9090 at `/mcp`. Rename `Config.toml.example` to `Config.toml` before running. Uses basic authentication (credentials are for local development only).

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
| `get_order(order_id)` | Retrieve order details |
| `list_orders(customer_id?, status?)` | List orders with optional filters |
| `update_order_status(order_id, status)` | Update an order's status |
| `create_refund(order_id, amount, reason)` | Issue a refund |
| `get_customer(customer_id)` | Retrieve customer details |

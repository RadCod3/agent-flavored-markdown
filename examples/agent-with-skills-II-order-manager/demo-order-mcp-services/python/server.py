"""Demo MCP server with mock order and customer data.

Equivalent to the Ballerina implementation — same tools, same mock data.
Requires: pip install mcp uvicorn
"""

import base64
import os
import secrets
import time

from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp, Receive, Scope, Send

from mcp.server.fastmcp import FastMCP

# ---------------------------------------------------------------------------
# Basic auth middleware — mock credentials for local development only
# ---------------------------------------------------------------------------

AUTH_USERNAME = os.environ.get("ORDER_SERVICE_USERNAME", "orderagent")
AUTH_PASSWORD = os.environ.get("ORDER_SERVICE_PASSWORD", "pw1234")



class BasicAuthMiddleware:
    """Simple HTTP Basic Auth ASGI middleware."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope)
        auth = request.headers.get("Authorization")
        if auth and self._verify(auth):
            await self.app(scope, receive, send)
            return

        response = Response(
            "Unauthorized",
            status_code=401,
            headers={"WWW-Authenticate": 'Basic realm="order_service"'},
        )
        await response(scope, receive, send)

    def _verify(self, header: str) -> bool:
        try:
            scheme, encoded = header.split(" ", 1)
            if scheme.lower() != "basic":
                return False
            decoded = base64.b64decode(encoded).decode("utf-8")
            username, password = decoded.split(":", 1)
            return secrets.compare_digest(username, AUTH_USERNAME) and secrets.compare_digest(
                password, AUTH_PASSWORD
            )
        except Exception:
            return False


class TrustedHostMiddleware:
    """Middleware to bypass host header validation for local/Docker development."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            # Rewrite the host header to localhost to pass Starlette's validation
            headers = dict(scope.get("headers", []))
            modified_headers = []
            for name, value in headers.items():
                if name == b"host":
                    # Replace any host with localhost:9090
                    modified_headers.append((name, b"localhost:9090"))
                else:
                    modified_headers.append((name, value))
            scope["headers"] = modified_headers
        
        await self.app(scope, receive, send)


mcp = FastMCP("order_service")

# ---------------------------------------------------------------------------
# Mock data
# ---------------------------------------------------------------------------

ORDERS = {
    "ORD-1001": {
        "order_id": "ORD-1001",
        "customer_id": "CUST-501",
        "status": "delivered",
        "items": [
            {"product_id": "PROD-A1", "name": "Wireless Headphones", "quantity": 1, "unit_price": 79.99},
            {"product_id": "PROD-B2", "name": "USB-C Cable", "quantity": 2, "unit_price": 12.99},
        ],
        "subtotal": 105.97,
        "tax": 8.48,
        "shipping": 5.99,
        "total": 120.44,
        "shipping_address": "123 Main St, Springfield, IL 62701",
        "tracking_number": "1Z999AA10123456784",
        "created_at": "2025-01-15T10:30:00Z",
        "delivered_at": "2025-01-20T14:22:00Z",
    },
    "ORD-1002": {
        "order_id": "ORD-1002",
        "customer_id": "CUST-502",
        "status": "delivered",
        "items": [
            {"product_id": "PROD-C3", "name": "Mechanical Keyboard", "quantity": 1, "unit_price": 149.99},
        ],
        "subtotal": 149.99,
        "tax": 12.00,
        "shipping": 0.00,
        "total": 161.99,
        "shipping_address": "456 Oak Ave, Portland, OR 97201",
        "tracking_number": "1Z999AA10987654321",
        "created_at": "2025-02-01T08:15:00Z",
        "delivered_at": "2025-02-05T11:30:00Z",
    },
    "ORD-1003": {
        "order_id": "ORD-1003",
        "customer_id": "CUST-501",
        "status": "pending",
        "items": [
            {"product_id": "PROD-D4", "name": "Monitor Stand", "quantity": 1, "unit_price": 45.00},
            {"product_id": "PROD-E5", "name": "Desk Lamp", "quantity": 1, "unit_price": 34.99},
        ],
        "subtotal": 79.99,
        "tax": 6.40,
        "shipping": 5.99,
        "total": 92.38,
        "shipping_address": "123 Main St, Springfield, IL 62701",
        "tracking_number": None,
        "created_at": "2025-02-10T16:45:00Z",
        "delivered_at": None,
    },
    "ORD-1004": {
        "order_id": "ORD-1004",
        "customer_id": "CUST-503",
        "status": "payment_failed",
        "items": [
            {"product_id": "PROD-F6", "name": "Ergonomic Chair", "quantity": 1, "unit_price": 599.99},
        ],
        "subtotal": 599.99,
        "tax": 48.00,
        "shipping": 0.00,
        "total": 647.99,
        "shipping_address": "789 Pine Rd, Austin, TX 78701",
        "tracking_number": None,
        "created_at": "2025-02-12T11:00:00Z",
        "delivered_at": None,
    },
    "ORD-1005": {
        "order_id": "ORD-1005",
        "customer_id": "CUST-502",
        "status": "delivered",
        "items": [
            {"product_id": "PROD-G7", "name": "Productivity Course (Digital Download)", "quantity": 1, "unit_price": 49.99},
        ],
        "subtotal": 49.99,
        "tax": 4.00,
        "shipping": 0.00,
        "total": 53.99,
        "shipping_address": "456 Oak Ave, Portland, OR 97201",
        "tracking_number": None,
        "created_at": "2025-02-15T09:20:00Z",
        "delivered_at": "2025-02-15T09:21:00Z",
    },
}

CUSTOMERS = {
    "CUST-501": {
        "customer_id": "CUST-501",
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "phone": "+1-555-0101",
        "default_payment_method": "Visa ending in 4242",
        "total_orders": 12,
        "issues_last_30_days": 1,
    },
    "CUST-502": {
        "customer_id": "CUST-502",
        "name": "Bob Smith",
        "email": "bob@example.com",
        "phone": "+1-555-0102",
        "default_payment_method": "PayPal (bob@example.com)",
        "total_orders": 3,
        "issues_last_30_days": 0,
    },
    "CUST-503": {
        "customer_id": "CUST-503",
        "name": "Carol Davis",
        "email": "carol@example.com",
        "phone": "+1-555-0103",
        "default_payment_method": "Mastercard ending in 8888",
        "total_orders": 27,
        "issues_last_30_days": 4,
    },
}

# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------


@mcp.tool()
def get_order(order_id: str) -> dict:
    """Retrieve an order by its ID (e.g., "ORD-1001")."""
    if order_id not in ORDERS:
        raise ValueError(f"Order '{order_id}' not found")
    return ORDERS[order_id]


@mcp.tool()
def list_orders(customer_id: str | None = None, status: str | None = None) -> list[dict]:
    """List orders, optionally filtered by customer ID or status."""
    results = []
    for order in ORDERS.values():
        if customer_id and order["customer_id"] != customer_id:
            continue
        if status and order["status"] != status:
            continue
        results.append(order)
    return results


@mcp.tool()
def update_order_status(order_id: str, status: str) -> str:
    """Update the status of an order (e.g., "refund_pending", "return_initiated", "cancelled")."""
    if order_id not in ORDERS:
        raise ValueError(f"Order '{order_id}' not found")
    ORDERS[order_id]["status"] = status
    return f"Order {order_id} status updated to '{status}'"


@mcp.tool()
def create_refund(order_id: str, amount: float, reason: str) -> dict:
    """Create a refund for an order. Reason examples: "defective", "wrong_item", "customer_request"."""
    if order_id not in ORDERS:
        raise ValueError(f"Order '{order_id}' not found")
    if amount <= 0:
        raise ValueError("Refund amount must be greater than zero")
    order = ORDERS[order_id]
    if amount > order["total"]:
        raise ValueError(f"Refund amount {amount} exceeds order total {order['total']}")

    refund_id = f"REF-{int(time.time())}"
    return {
        "refund_id": refund_id,
        "order_id": order_id,
        "amount": amount,
        "method": "original_payment" if amount == order["total"] else "store_credit",
        "reason": reason,
        "status": "processing",
        "estimated_arrival": "5-10 business days",
    }


@mcp.tool()
def get_customer(customer_id: str) -> dict:
    """Retrieve a customer by their ID (e.g., "CUST-501")."""
    if customer_id not in CUSTOMERS:
        raise ValueError(f"Customer '{customer_id}' not found")
    return CUSTOMERS[customer_id]


if __name__ == "__main__":
    import uvicorn

    app = mcp.streamable_http_app()
    app = TrustedHostMiddleware(app)
    app = BasicAuthMiddleware(app)
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=9090,
        server_header=False,
        forwarded_allow_ips="*"
    )

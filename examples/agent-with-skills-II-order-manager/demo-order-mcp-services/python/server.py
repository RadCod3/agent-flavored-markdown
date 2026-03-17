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
        "orderId": "ORD-1001",
        "customerId": "CUST-501",
        "status": "delivered",
        "items": [
            {"productId": "PROD-A1", "name": "Wireless Headphones", "quantity": 1, "unitPrice": 79.99},
            {"productId": "PROD-B2", "name": "USB-C Cable", "quantity": 2, "unitPrice": 12.99},
        ],
        "subtotal": 105.97,
        "tax": 8.48,
        "shipping": 5.99,
        "total": 120.44,
        "shippingAddress": "123 Main St, Springfield, IL 62701",
        "trackingNumber": "1Z999AA10123456784",
        "createdAt": "2025-01-15T10:30:00Z",
        "deliveredAt": "2025-01-20T14:22:00Z",
    },
    "ORD-1002": {
        "orderId": "ORD-1002",
        "customerId": "CUST-502",
        "status": "delivered",
        "items": [
            {"productId": "PROD-C3", "name": "Mechanical Keyboard", "quantity": 1, "unitPrice": 149.99},
        ],
        "subtotal": 149.99,
        "tax": 12.00,
        "shipping": 0.00,
        "total": 161.99,
        "shippingAddress": "456 Oak Ave, Portland, OR 97201",
        "trackingNumber": "1Z999AA10987654321",
        "createdAt": "2025-02-01T08:15:00Z",
        "deliveredAt": "2025-02-05T11:30:00Z",
    },
    "ORD-1003": {
        "orderId": "ORD-1003",
        "customerId": "CUST-501",
        "status": "pending",
        "items": [
            {"productId": "PROD-D4", "name": "Monitor Stand", "quantity": 1, "unitPrice": 45.00},
            {"productId": "PROD-E5", "name": "Desk Lamp", "quantity": 1, "unitPrice": 34.99},
        ],
        "subtotal": 79.99,
        "tax": 6.40,
        "shipping": 5.99,
        "total": 92.38,
        "shippingAddress": "123 Main St, Springfield, IL 62701",
        "trackingNumber": None,
        "createdAt": "2025-02-10T16:45:00Z",
        "deliveredAt": None,
    },
    "ORD-1004": {
        "orderId": "ORD-1004",
        "customerId": "CUST-503",
        "status": "payment_failed",
        "items": [
            {"productId": "PROD-F6", "name": "Ergonomic Chair", "quantity": 1, "unitPrice": 599.99},
        ],
        "subtotal": 599.99,
        "tax": 48.00,
        "shipping": 0.00,
        "total": 647.99,
        "shippingAddress": "789 Pine Rd, Austin, TX 78701",
        "trackingNumber": None,
        "createdAt": "2025-02-12T11:00:00Z",
        "deliveredAt": None,
    },
    "ORD-1005": {
        "orderId": "ORD-1005",
        "customerId": "CUST-502",
        "status": "delivered",
        "items": [
            {"productId": "PROD-G7", "name": "Productivity Course (Digital Download)", "quantity": 1, "unitPrice": 49.99},
        ],
        "subtotal": 49.99,
        "tax": 4.00,
        "shipping": 0.00,
        "total": 53.99,
        "shippingAddress": "456 Oak Ave, Portland, OR 97201",
        "trackingNumber": None,
        "createdAt": "2025-02-15T09:20:00Z",
        "deliveredAt": "2025-02-15T09:21:00Z",
    },
}

CUSTOMERS = {
    "CUST-501": {
        "customerId": "CUST-501",
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "phone": "+1-555-0101",
        "defaultPaymentMethod": "Visa ending in 4242",
        "totalOrders": 12,
        "issuesLast30Days": 1,
    },
    "CUST-502": {
        "customerId": "CUST-502",
        "name": "Bob Smith",
        "email": "bob@example.com",
        "phone": "+1-555-0102",
        "defaultPaymentMethod": "PayPal (bob@example.com)",
        "totalOrders": 3,
        "issuesLast30Days": 0,
    },
    "CUST-503": {
        "customerId": "CUST-503",
        "name": "Carol Davis",
        "email": "carol@example.com",
        "phone": "+1-555-0103",
        "defaultPaymentMethod": "Mastercard ending in 8888",
        "totalOrders": 27,
        "issuesLast30Days": 4,
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
        if customer_id and order["customerId"] != customer_id:
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
    # In a real implementation, this would persist the status change
    return f"Order {order_id} status updated to '{status}'"


@mcp.tool()
def create_refund(order_id: str, amount: float, reason: str) -> dict:
    """Create a refund for an order. Reason examples: "defective", "wrong_item", "customer_request"."""
    if order_id not in ORDERS:
        raise ValueError(f"Order '{order_id}' not found")
    order = ORDERS[order_id]
    if amount > order["total"]:
        raise ValueError(f"Refund amount {amount} exceeds order total {order['total']}")

    refund_id = f"REF-{int(time.time())}"
    return {
        "refundId": refund_id,
        "orderId": order_id,
        "amount": amount,
        "method": "original_payment" if amount == order["total"] else "store_credit",
        "reason": reason,
        "status": "processing",
        "estimatedArrival": "5-10 business days",
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

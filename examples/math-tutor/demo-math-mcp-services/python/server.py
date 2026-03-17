"""Demo MCP server with basic math operations.

Equivalent to the Ballerina implementation — same tools, same behavior.
Requires: pip install mcp uvicorn
"""

import logging

from starlette.requests import Request
from starlette.types import ASGIApp, Receive, Scope, Send

from mcp.server.fastmcp import FastMCP

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrustedHostMiddleware:
    """Middleware to bypass host header validation for local/Docker development."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            headers = dict(scope.get("headers", []))
            modified_headers = []
            for name, value in headers.items():
                if name == b"host":
                    modified_headers.append((name, b"localhost:9090"))
                else:
                    modified_headers.append((name, value))
            scope["headers"] = modified_headers

        await self.app(scope, receive, send)


mcp = FastMCP("math_operations")

# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------


@mcp.tool()
def add(a: float, b: float) -> dict:
    """Add two numbers.

    Args:
        a: First number
        b: Second number

    Returns:
        Sum of the two numbers
    """
    result = a + b
    logger.info(f"Addition: {a} + {b} = {result}")
    return {
        "result": result,
        "operation": "addition",
        "expression": f"{a} + {b}",
    }


@mcp.tool()
def subtract(a: float, b: float) -> dict:
    """Subtract one number from another.

    Args:
        a: First number
        b: Second number (subtracted from first)

    Returns:
        Difference of the two numbers
    """
    result = a - b
    logger.info(f"Subtraction: {a} - {b} = {result}")
    return {
        "result": result,
        "operation": "subtraction",
        "expression": f"{a} - {b}",
    }


@mcp.tool()
def multiply(a: float, b: float) -> dict:
    """Multiply two numbers.

    Args:
        a: First number
        b: Second number

    Returns:
        Product of the two numbers
    """
    result = a * b
    logger.info(f"Multiplication: {a} × {b} = {result}")
    return {
        "result": result,
        "operation": "multiplication",
        "expression": f"{a} × {b}",
    }


@mcp.tool()
def divide(a: float, b: float) -> dict:
    """Divide one number by another.

    Args:
        a: Dividend
        b: Divisor (cannot be zero)

    Returns:
        Quotient of the two numbers
    """
    if b == 0:
        raise ValueError("Division by zero is not allowed")
    result = a / b
    logger.info(f"Division: {a} ÷ {b} = {result}")
    return {
        "result": result,
        "operation": "division",
        "expression": f"{a} ÷ {b}",
    }


if __name__ == "__main__":
    import uvicorn

    app = mcp.streamable_http_app()
    app = TrustedHostMiddleware(app)
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=9090,
        server_header=False,
        forwarded_allow_ips="*",
    )

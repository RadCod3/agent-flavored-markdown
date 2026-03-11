import ballerina/http;
import ballerina/mcp;
import ballerina/time;

type OrderItem record {|
    string productId;
    string name;
    int quantity;
    decimal unitPrice;
|};

type Order record {|
    string orderId;
    string customerId;
    string status;
    OrderItem[] items;
    decimal subtotal;
    decimal tax;
    decimal shipping;
    decimal total;
    string shippingAddress;
    string? trackingNumber;
    string createdAt;
    string? deliveredAt;
|};

type Customer record {|
    string customerId;
    string name;
    string email;
    string phone;
    string defaultPaymentMethod;
    int totalOrders;
    int issuesLast30Days;
|};

type RefundResult record {|
    string refundId;
    string orderId;
    decimal amount;
    string method;
    string reason;
    string status;
    string estimatedArrival;
|};

// In-memory mock data
final map<Order> & readonly orders = {
    "ORD-1001": {
        orderId: "ORD-1001",
        customerId: "CUST-501",
        status: "delivered",
        items: [
            {productId: "PROD-A1", name: "Wireless Headphones", quantity: 1, unitPrice: 79.99d},
            {productId: "PROD-B2", name: "USB-C Cable", quantity: 2, unitPrice: 12.99d}
        ],
        subtotal: 105.97d,
        tax: 8.48d,
        shipping: 5.99d,
        total: 120.44d,
        shippingAddress: "123 Main St, Springfield, IL 62701",
        trackingNumber: "1Z999AA10123456784",
        createdAt: "2025-01-15T10:30:00Z",
        deliveredAt: "2025-01-20T14:22:00Z"
    },
    "ORD-1002": {
        orderId: "ORD-1002",
        customerId: "CUST-502",
        status: "delivered",
        items: [
            {productId: "PROD-C3", name: "Mechanical Keyboard", quantity: 1, unitPrice: 149.99d}
        ],
        subtotal: 149.99d,
        tax: 12.00d,
        shipping: 0.00d,
        total: 161.99d,
        shippingAddress: "456 Oak Ave, Portland, OR 97201",
        trackingNumber: "1Z999AA10987654321",
        createdAt: "2025-02-01T08:15:00Z",
        deliveredAt: "2025-02-05T11:30:00Z"
    },
    "ORD-1003": {
        orderId: "ORD-1003",
        customerId: "CUST-501",
        status: "pending",
        items: [
            {productId: "PROD-D4", name: "Monitor Stand", quantity: 1, unitPrice: 45.00d},
            {productId: "PROD-E5", name: "Desk Lamp", quantity: 1, unitPrice: 34.99d}
        ],
        subtotal: 79.99d,
        tax: 6.40d,
        shipping: 5.99d,
        total: 92.38d,
        shippingAddress: "123 Main St, Springfield, IL 62701",
        trackingNumber: (),
        createdAt: "2025-02-10T16:45:00Z",
        deliveredAt: ()
    },
    "ORD-1004": {
        orderId: "ORD-1004",
        customerId: "CUST-503",
        status: "payment_failed",
        items: [
            {productId: "PROD-F6", name: "Ergonomic Chair", quantity: 1, unitPrice: 599.99d}
        ],
        subtotal: 599.99d,
        tax: 48.00d,
        shipping: 0.00d,
        total: 647.99d,
        shippingAddress: "789 Pine Rd, Austin, TX 78701",
        trackingNumber: (),
        createdAt: "2025-02-12T11:00:00Z",
        deliveredAt: ()
    },
    "ORD-1005": {
        orderId: "ORD-1005",
        customerId: "CUST-502",
        status: "delivered",
        items: [
            {productId: "PROD-G7", name: "Productivity Course (Digital Download)", quantity: 1, unitPrice: 49.99d}
        ],
        subtotal: 49.99d,
        tax: 4.00d,
        shipping: 0.00d,
        total: 53.99d,
        shippingAddress: "456 Oak Ave, Portland, OR 97201",
        trackingNumber: (),
        createdAt: "2025-02-15T09:20:00Z",
        deliveredAt: "2025-02-15T09:21:00Z"
    }
};

final map<Customer> & readonly customers = {
    "CUST-501": {
        customerId: "CUST-501",
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1-555-0101",
        defaultPaymentMethod: "Visa ending in 4242",
        totalOrders: 12,
        issuesLast30Days: 1
    },
    "CUST-502": {
        customerId: "CUST-502",
        name: "Bob Smith",
        email: "bob@example.com",
        phone: "+1-555-0102",
        defaultPaymentMethod: "PayPal (bob@example.com)",
        totalOrders: 3,
        issuesLast30Days: 0
    },
    "CUST-503": {
        customerId: "CUST-503",
        name: "Carol Davis",
        email: "carol@example.com",
        phone: "+1-555-0103",
        defaultPaymentMethod: "Mastercard ending in 8888",
        totalOrders: 27,
        issuesLast30Days: 4
    }
};

listener mcp:Listener mcpListener = new (9090);

@http:ServiceConfig {
    auth: [
        {
            fileUserStoreConfig: {},
            scopes: ["admin"]
        }
    ]
}
service mcp:Service /mcp on mcpListener {

    # Retrieve an order by its ID.
    #
    # + orderId - the order ID (e.g., "ORD-1001")
    # + return - the order details, or an error if not found
    remote function get_order(string orderId) returns Order|error {
        Order? 'order = orders[orderId];
        if 'order is () {
            return error(string `Order '${orderId}' not found`);
        }
        return 'order;
    }

    # List orders, optionally filtered by customer ID or status.
    #
    # + customerId - filter by customer ID (optional)
    # + status - filter by order status (optional, e.g., "pending", "shipped", "delivered")
    # + return - matching orders
    remote function list_orders(string? customerId = (), string? status = ()) returns Order[] {
        Order[] result = [];
        foreach Order 'order in orders {
            if customerId is string && 'order.customerId != customerId {
                continue;
            }
            if status is string && 'order.status != status {
                continue;
            }
            result.push('order);
        }
        return result;
    }

    # Update the status of an order.
    #
    # + orderId - the order ID
    # + status - the new status (e.g., "refund_pending", "return_initiated", "cancelled")
    # + return - confirmation message, or an error if the order is not found
    remote function update_order_status(string orderId, string status) returns string|error {
        Order? 'order = orders[orderId];
        if 'order is () {
            return error(string `Order '${orderId}' not found`);
        }
        // In a real implementation, this would persist the status change
        return string `Order ${orderId} status updated to '${status}'`;
    }

    # Create a refund for an order.
    #
    # + orderId - the order ID to refund
    # + amount - the refund amount
    # + reason - the reason for the refund (e.g., "defective", "wrong_item", "customer_request")
    # + return - the refund details, or an error if the order is not found
    remote function create_refund(string orderId, decimal amount, string reason) returns RefundResult|error {
        Order? 'order = orders[orderId];
        if 'order is () {
            return error(string `Order '${orderId}' not found`);
        }
        if amount > 'order.total {
            return error(string `Refund amount ${amount} exceeds order total ${'order.total}`);
        }

        string refundId = string `REF-${time:utcNow()[0]}`;
        return {
            refundId,
            orderId,
            amount,
            method: amount == 'order.total ? "original_payment" : "store_credit",
            reason,
            status: "processing",
            estimatedArrival: "5-10 business days"
        };
    }

    # Retrieve a customer by their ID.
    #
    # + customerId - the customer ID (e.g., "CUST-501")
    # + return - the customer details, or an error if not found
    remote function get_customer(string customerId) returns Customer|error {
        Customer? customer = customers[customerId];
        if customer is () {
            return error(string `Customer '${customerId}' not found`);
        }
        return customer;
    }
}

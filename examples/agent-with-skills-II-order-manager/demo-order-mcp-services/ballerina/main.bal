import ballerina/http;
import ballerina/mcp;
import ballerina/time;

type OrderItem record {|
    string product_id;
    string name;
    int quantity;
    decimal unit_price;
|};

type Order record {|
    string order_id;
    string customer_id;
    string status;
    OrderItem[] items;
    decimal subtotal;
    decimal tax;
    decimal shipping;
    decimal total;
    string shipping_address;
    string? tracking_number;
    string created_at;
    string? delivered_at;
|};

type Customer record {|
    string customer_id;
    string name;
    string email;
    string phone;
    string default_payment_method;
    int total_orders;
    int issues_last_30_days;
|};

type RefundResult record {|
    string refund_id;
    string order_id;
    decimal amount;
    string method;
    string reason;
    string status;
    string estimated_arrival;
|};

// In-memory mock data
isolated map<Order> orders = {
    "ORD-1001": {
        order_id: "ORD-1001",
        customer_id: "CUST-501",
        status: "delivered",
        items: [
            {product_id: "PROD-A1", name: "Wireless Headphones", quantity: 1, unit_price: 79.99d},
            {product_id: "PROD-B2", name: "USB-C Cable", quantity: 2, unit_price: 12.99d}
        ],
        subtotal: 105.97d,
        tax: 8.48d,
        shipping: 5.99d,
        total: 120.44d,
        shipping_address: "123 Main St, Springfield, IL 62701",
        tracking_number: "1Z999AA10123456784",
        created_at: "2025-01-15T10:30:00Z",
        delivered_at: "2025-01-20T14:22:00Z"
    },
    "ORD-1002": {
        order_id: "ORD-1002",
        customer_id: "CUST-502",
        status: "delivered",
        items: [
            {product_id: "PROD-C3", name: "Mechanical Keyboard", quantity: 1, unit_price: 149.99d}
        ],
        subtotal: 149.99d,
        tax: 12.00d,
        shipping: 0.00d,
        total: 161.99d,
        shipping_address: "456 Oak Ave, Portland, OR 97201",
        tracking_number: "1Z999AA10987654321",
        created_at: "2025-02-01T08:15:00Z",
        delivered_at: "2025-02-05T11:30:00Z"
    },
    "ORD-1003": {
        order_id: "ORD-1003",
        customer_id: "CUST-501",
        status: "pending",
        items: [
            {product_id: "PROD-D4", name: "Monitor Stand", quantity: 1, unit_price: 45.00d},
            {product_id: "PROD-E5", name: "Desk Lamp", quantity: 1, unit_price: 34.99d}
        ],
        subtotal: 79.99d,
        tax: 6.40d,
        shipping: 5.99d,
        total: 92.38d,
        shipping_address: "123 Main St, Springfield, IL 62701",
        tracking_number: (),
        created_at: "2025-02-10T16:45:00Z",
        delivered_at: ()
    },
    "ORD-1004": {
        order_id: "ORD-1004",
        customer_id: "CUST-503",
        status: "payment_failed",
        items: [
            {product_id: "PROD-F6", name: "Ergonomic Chair", quantity: 1, unit_price: 599.99d}
        ],
        subtotal: 599.99d,
        tax: 48.00d,
        shipping: 0.00d,
        total: 647.99d,
        shipping_address: "789 Pine Rd, Austin, TX 78701",
        tracking_number: (),
        created_at: "2025-02-12T11:00:00Z",
        delivered_at: ()
    },
    "ORD-1005": {
        order_id: "ORD-1005",
        customer_id: "CUST-502",
        status: "delivered",
        items: [
            {product_id: "PROD-G7", name: "Productivity Course (Digital Download)", quantity: 1, unit_price: 49.99d}
        ],
        subtotal: 49.99d,
        tax: 4.00d,
        shipping: 0.00d,
        total: 53.99d,
        shipping_address: "456 Oak Ave, Portland, OR 97201",
        tracking_number: (),
        created_at: "2025-02-15T09:20:00Z",
        delivered_at: "2025-02-15T09:21:00Z"
    }
};

final map<Customer> & readonly customers = {
    "CUST-501": {
        customer_id: "CUST-501",
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1-555-0101",
        default_payment_method: "Visa ending in 4242",
        total_orders: 12,
        issues_last_30_days: 1
    },
    "CUST-502": {
        customer_id: "CUST-502",
        name: "Bob Smith",
        email: "bob@example.com",
        phone: "+1-555-0102",
        default_payment_method: "PayPal (bob@example.com)",
        total_orders: 3,
        issues_last_30_days: 0
    },
    "CUST-503": {
        customer_id: "CUST-503",
        name: "Carol Davis",
        email: "carol@example.com",
        phone: "+1-555-0103",
        default_payment_method: "Mastercard ending in 8888",
        total_orders: 27,
        issues_last_30_days: 4
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
    # + order_id - the order ID (e.g., "ORD-1001")
    # + return - the order details, or an error if not found
    isolated remote function get_order(string order_id) returns Order|error {
        lock {
            if !orders.hasKey(order_id) {
                return error(string `Order '${order_id}' not found`);
            }
            return orders.get(order_id).clone();
        }
    }

    # List orders, optionally filtered by customer ID or status.
    #
    # + customer_id - filter by customer ID (optional)
    # + status - filter by order status (optional, e.g., "pending", "shipped", "delivered")
    # + return - matching orders
    remote function list_orders(string? customer_id = (), string? status = ()) returns Order[] {
        lock {
            return <readonly> from Order 'order in orders
                     where (customer_id is () || 'order.customer_id == customer_id) &&
                             (status is () || 'order.status == status)
                     select 'order.cloneReadOnly();
        }
    }

    # Update the status of an order.
    #
    # + order_id - the order ID
    # + status - the new status (e.g., "refund_pending", "return_initiated", "cancelled")
    # + return - confirmation message, or an error if the order is not found
    remote function update_order_status(string order_id, string status) returns error? {
        lock {
            if !orders.hasKey(order_id) {
                return error(string `Order '${order_id}' not found`);
            }
            Order 'order = orders.get(order_id);
            'order.status = status;
        }
    }

    # Create a refund for an order.
    #
    # + order_id - the order ID to refund
    # + amount - the refund amount
    # + reason - the reason for the refund (e.g., "defective", "wrong_item", "customer_request")
    # + return - the refund details, or an error if the order is not found
    remote function create_refund(string order_id, decimal amount, string reason) returns RefundResult|error {
        Order? 'order;

        lock {
            'order = orders[order_id].clone();
        }

        if 'order is () {
            return error(string `Order '${order_id}' not found`);
        }

        if amount <= 0d {
            return error("Refund amount must be greater than zero");
        }

        if amount > 'order.total {
            return error(string `Refund amount ${amount} exceeds order total ${'order.total}`);
        }

        string refund_id = string `REF-${time:utcNow()[0]}`;
        return {
            refund_id,
            order_id,
            amount,
            method: amount == 'order.total ? "original_payment" : "store_credit",
            reason,
            status: "processing",
            estimated_arrival: "5-10 business days"
        };
    }

    # Retrieve a customer by their ID.
    #
    # + customer_id - the customer ID (e.g., "CUST-501")
    # + return - the customer details, or an error if not found
    remote function get_customer(string customer_id) returns Customer|error {
        Customer? customer = customers[customer_id];
        if customer is () {
            return error(string `Customer '${customer_id}' not found`);
        }
        return customer;
    }
}

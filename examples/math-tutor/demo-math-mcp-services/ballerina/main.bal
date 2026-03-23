import ballerina/log;
import ballerina/mcp;

# Represents result of a math operation.
type MathResult record {|
    # The result of the operation
    decimal result;
    # The type of operation performed (e.g., addition, subtraction)
    string operation;
    # The expression that was evaluated (e.g., "3 + 5")
    string expression;
|};

listener mcp:Listener mcpListener = new (9090);

service mcp:Service /mcp on mcpListener {

    # Add two numbers.
    # 
    # + a - First number
    # + b - Second number
    # + return - Sum of the two numbers
    remote function add(decimal a, decimal b) returns MathResult {
        decimal result = a + b;
        log:printInfo(string `Addition: ${a} + ${b} = ${result}`);
        return {
            result,
            operation: "addition",
            expression: string `${a} + ${b}`
        };
    }

    # Subtract one number from another.
    # 
    # + a - First number
    # + b - Second number (subtracted from first)
    # + return - Difference of the two numbers
    remote function subtract(decimal a, decimal b) returns MathResult {
        decimal result = a - b;
        log:printInfo(string `Subtraction: ${a} - ${b} = ${result}`);
        return {
            result,
            operation: "subtraction",
            expression: string `${a} - ${b}`
        };
    }

    # Multiply two numbers.
    # 
    # + a - First number
    # + b - Second number
    # + return - Product of the two numbers
    remote function multiply(decimal a, decimal b) returns MathResult {
        decimal result = a * b;
        log:printInfo(string `Multiplication: ${a} × ${b} = ${result}`);
        return {
            result,
            operation: "multiplication",
            expression: string `${a} × ${b}`
        };
    }

    # Divide one number by another.
    # 
    # + a - Dividend
    # + b - Divisor (cannot be zero)
    # + return - Quotient of the two numbers or error if divisor is zero
    remote function divide(decimal a, decimal b) returns MathResult|error {
        if b == 0d {
            return error("Division by zero is not allowed");
        }
        decimal result = a / b;
        log:printInfo(string `Division: ${a} ÷ ${b} = ${result}`);
        return {
            result,
            operation: "division",
            expression: string `${a} ÷ ${b}`
        };
    }
}

---
title: Getting Started
description: A guide to creating your first AI agent using Agent-Flavored Markdown (AFM).
hide:
  - navigation
  - toc
---

# Getting Started with Agent-Flavored Markdown

This guide walks through the implementation of a simple Greeter Agent, introducing AFM concepts.

## Agent File Structure

AFM is a simple, text-based format for defining AI agents. It uses a combination of a YAML front matter for configuration and a Markdown body for instructions. This makes it easy for both humans and machines to read and write.

An AFM file has two main parts:

1.  **Front Matter**: A YAML block at the top of the file, enclosed by `---`. It contains metadata and configuration for the agent, such as its name, the AI model it uses, and any tools it has access to.
2.  **Markdown Body**: The rest of the file, which contains the agent's instructions written in Markdown. This is where you define the agent's role (its purpose and responsibilities) and its instructions (directives governing its behavior).

## Your First AFM Agent

Let's create a simple "Greeter" agent. We'll start by defining what the agent does, and then we'll add the necessary metadata and configuration.

### 1. Defining the Role and Instructions

The core of any AFM agent is its **Role** and **Instructions**. This is where you define the agent's persona and the tasks it should perform.

For our Greeter agent, we'll keep it simple:

```markdown
# Role

You are a friendly and polite greeter.

# Instructions

Your task is to greet the user. When the user says something to you, you should respond with a friendly greeting.
```

*   **`# Role`**: Defines the agent's purpose and responsibilities (its persona).
*   **`# Instructions`**: Provides directives governing the agent's behavior.

### 2. Adding Metadata and Configuration

Next, we add the **Front Matter**. This is the YAML block at the top of the file that contains metadata about the agent and configuration for the AI model it will use.

```yaml
---
spec_version: "0.3.0"
name: "Greeter"
description: "A simple agent that greets the user."
model:
  name: "gpt-4o"
  provider: "openai"
  authentication:
    type: "api-key"
    api_key: "${env:OPENAI_API_KEY}"
---
```

*   **`spec_version`**: Specifies the version of the AFM specification the file adheres to.
*   **`name`**: The name of our agent.
*   **`description`**: A short description of what the agent does.
*   **`model`**: This section specifies the AI model the agent will use (OpenAI's `gpt-4o`) and how to authenticate using an environment variable.

### 3. The Complete AFM File

Putting it all together, our complete `greeter.afm.md` file looks like this:

<div class="demo-code">
  <div class="demo-code-header">
    <span class="demo-file-name">greeter.afm.md</span>
  </div>
  <div class="demo-code-content">

```markdown
---
spec_version: "0.3.0"
name: "Greeter"
description: "A simple agent that greets the user."
model:
  name: "gpt-4o"
  provider: "openai"
  authentication:
    type: "api-key"
    api_key: "${env:OPENAI_API_KEY}"
---

# Role

You are a friendly and polite greeter.

# Instructions

Your task is to greet the user. When the user says something to you, you should respond with a friendly greeting.
```

</div>
</div>

## What's Next?

Use the AFM file with a tool or platform that supports AFM. See [Reference Implementations](reference-implementations.md) for options.

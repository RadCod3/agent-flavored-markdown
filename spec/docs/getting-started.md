---
title: Getting Started
description: A guide to creating your first AI agent using Agent-Flavored Markdown (AFM).
hide:
  - navigation
  - toc
---

# Getting Started with Agent-Flavored Markdown

Welcome to Agent-Flavored Markdown (AFM)! This guide will walk you through creating your first AI agent using AFM.

## What is AFM?

AFM is a simple, text-based format for defining AI agents. It uses a combination of a YAML front matter for configuration and a Markdown body for instructions. This makes it easy for both humans and machines to read and write.

An AFM file has two main parts:

1.  **Front Matter**: A YAML block at the top of the file, enclosed by `---` lines. It contains metadata and configuration for the agent, such as its name, the AI model it uses, and any tools it has access to.
2.  **Markdown Body**: The rest of the file, which contains the agent's instructions written in Markdown. This is where you define the agent's role and what it should do.

## Your First AFM Agent

Let's create a simple "Greeter" agent that just says hello.

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

## Understanding the "Greeter" Agent

Let's break down the `greeter.afm.md` file:

### Front Matter

*   **`spec_version`**: Specifies the version of the AFM specification the file adheres to.
*   **`name`**: The name of our agent.
*   **`description`**: A short description of what the agent does.
*   **`model`**:  This section specifies the AI model the agent will use. In this case, it's OpenAI's `gpt-4o`. It also specifies that the API key should be read from an environment variable named `OPENAI_API_KEY`.

### Markdown Body

*   **`# Role`**: This is a top-level heading in the Markdown body. It defines the agent's persona.
*   **`# Instructions`**: This section tells the agent what to do.

## What's Next?

Now that you have your first AFM file, you can use it with a compatible tool or platform that supports AFM. Such a tool would read your `greeter.afm.md` file and provide you with a running "Greeter" agent. See the [Reference Implementations](reference-implementations.md) for examples of tools you can use.

You can now explore the rest of the documentation to learn more about the [AFM specification](specification.md), its features, and more complex examples.

---
title: Getting Started
description: A guide to creating your first AI agent using Agent-Flavored Markdown (AFM).
hide:
  - navigation
  - toc
---

# Getting Started with Agent-Flavored Markdown

This guide walks through the implementation of a simple Friendly Assistant agent, introducing AFM concepts.

## Agent File Structure

AFM is a simple, Markdown-based format for defining AI agents. It uses Markdown for instructions with YAML front matter for configuration and metadata. This improves authoring and readability of AI Agents for both humans and machines.

An AFM file has two main parts:

1.  **Front Matter**: A YAML block at the top of the file, enclosed by `---`. It contains metadata and configuration for the agent, such as its name, the AI model it uses, and any tools it has access to.
2.  **Markdown Body**: The rest of the file, which contains the agent's instructions written in Markdown. This is where you define the agent's role (its purpose and responsibilities) and its instructions (directives governing its behavior).

## Your First AFM Agent

Let's create a simple "Friendly Assistant" agent. We'll start by defining what the agent does, and then we'll add the necessary metadata and configuration.

### 1. Defining the Role and Instructions

The core of any AFM agent is its **Role** and **Instructions**. This is where you define the agent's persona and the tasks it should perform.

For our Friendly Assistant, we'll keep it simple:

```markdown
# Role

You are a friendly and helpful conversational assistant. Your purpose is to engage in
natural, helpful conversations with users, answering their questions, providing
information, and assisting with various tasks to the best of your abilities.

# Instructions

- Always respond in a friendly and conversational tone
- Keep your responses clear, concise, and easy to understand
- If you don't know something, be honest about it
- Ask clarifying questions when the user's request is ambiguous
- Be helpful and try to provide practical, actionable advice
- Maintain context throughout the conversation
- Show empathy and understanding in your responses
```

*   **`# Role`**: Defines the agent's purpose and responsibilities (its persona).
*   **`# Instructions`**: Provides directives governing the agent's behavior.

### 2. Adding Metadata and Configuration

Next, we add the **Front Matter**. This is the YAML block at the top of the file that contains metadata about the agent and configuration for the AI model it will use.

```yaml
---
spec_version: "0.3.0"
name: "Friendly Assistant"
description: "A friendly conversational assistant that helps users with various tasks."
version: "0.1.0"
license: "Apache-2.0"
model:
  name: "gpt-4o"
  provider: "openai"
  authentication:
    type: "api-key"
    api_key: "${env:OPENAI_API_KEY}"
interfaces:
  - type: "consolechat"
max_iterations: 5
---
```

*   **`spec_version`**: Specifies the version of the AFM specification the file adheres to.
*   **`name`**: The name of our agent.
*   **`description`**: A short description of what the agent does.
*   **`version`**: The version of our agent.
*   **`model`**: This section specifies the AI model the agent will use (OpenAI's `gpt-4o`) and how to authenticate using an environment variable.
*   **`interfaces`**: This section defines how the agent can be interacted with. In this case, we're exposing it as a command-line chat interface.
*   **`max_iterations`**: The maximum number of iterations the agent can perform in a single run.

### 3. The Complete AFM File

Putting it all together, our complete `friendly_assistant.afm.md` file looks like this:

<div class="demo-code">
  <div class="demo-code-header">
    <span class="demo-file-name">friendly_assistant.afm.md</span>
  </div>
  <div class="demo-code-content">

```markdown
---
spec_version: "0.3.0"
name: "Friendly Assistant"
description: "A friendly conversational assistant that helps users with various tasks."
version: "0.1.0"
license: "Apache-2.0"
model:
  name: "gpt-4o"
  provider: "openai"
  authentication:
    type: "api-key"
    api_key: "${env:OPENAI_API_KEY}"
interfaces:
  - type: "consolechat"
max_iterations: 5
---

# Role

You are a friendly and helpful conversational assistant. Your purpose is to engage in
natural, helpful conversations with users, answering their questions, providing
information, and assisting with various tasks to the best of your abilities.

# Instructions

- Always respond in a friendly and conversational tone
- Keep your responses clear, concise, and easy to understand
- If you don't know something, be honest about it
- Ask clarifying questions when the user's request is ambiguous
- Be helpful and try to provide practical, actionable advice
- Maintain context throughout the conversation
- Show empathy and understanding in your responses
```

</div>
</div>

## What's Next?

Use the AFM file with a tool or platform that supports AFM. See [Reference Implementations](reference-implementations.md) for options. For a complete overview of all AFM features, see the [Specification](specification.md).

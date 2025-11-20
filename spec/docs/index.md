---
hide:
  - navigation
  - toc
---

# Agent Flavored Markdown (AFM)

A simple, markdown-based format for defining AI agents. Write agents in plain text that any platform can understand and deploy.

```markdown
---
spec_version: "0.3.0"
name: "Code Review Assistant"
description: "An AI assistant that helps review code and suggests improvements"
tools:
  mcp:
    servers:
      - name: "github"
        transport:
          type: "stdio"
          command: "npx -y @modelcontextprotocol/server-github"
---

# Role

You are an experienced code review assistant with deep expertise in software engineering best practices, security
patterns, and maintainable code design. Your purpose is to help developers write better code by providing thoughtful,
actionable feedback on pull requests and code changes.

You approach every review with empathy, understanding that code is written by humans who are learning and growing.
Your feedback should educate and empower, not discourage.

# Instructions

When reviewing code, follow this systematic approach:

1. **Security First**: Scan for common vulnerabilities like SQL injection, XSS, authentication issues, or exposed
   secrets. These are your highest priority.

2. **Correctness**: Check for logical errors, edge cases, null pointer risks, and race conditions that could cause
   bugs in production.

3. **Performance**: Identify inefficient algorithms, unnecessary database queries, memory leaks, or blocking
   operations that could impact user experience.

4. **Maintainability**: Look for code that's hard to understand, poorly named variables, missing documentation, or
   violations of established patterns.

5. **Testing**: Verify that appropriate test coverage exists and tests actually validate the behavior.

For each issue you find:
- Explain WHY it's a problem, not just WHAT is wrong
- Suggest a specific improvement with code examples when helpful
- Indicate severity: Critical, Important, or Nice-to-have
- Link to relevant documentation or best practices when available

Always acknowledge what's done well. Positive reinforcement matters.
```

## Why AFM?

<div class="grid cards" markdown>

- :fontawesome-solid-feather: __Simple__

    Write agents in plain markdown. No complex code or proprietary formats required.

- :material-share-variant: __Shareable__

    AFM agents work across different platforms and tools. Write once, deploy anywhere.

- :material-account-group: __Collaborative__

    Build multi-agent systems where agents work together to solve complex problems.

</div>

**Want to learn more?** Check out [Why AFM?](topics/why-afm.md) to understand the problem AFM solves and how it compares to other approaches.

<!-- ## The AFM Workflow

The process is designed to be straightforward. Agents are defined in natural language, allowing everyone can contribute to the agent's capabilities. Once defined, these agents can be deployed and interacted with seamlessly. 
    
<div class="workflow-steps">
    <span class="workflow-step">1. Write the agent in natural language</span>
    <span class="workflow-arrow">→</span>
    <span class="workflow-step">2. Deploy</span>
    <span class="workflow-arrow">→</span>
    <span class="workflow-step">3. Interact</span>
</div>

!!! warning "WIP"
    Update this section with more detailed explanations and a diagram. -->

## Get Started

<div class="button-container">
    <a href="specification" class="md-button md-button--primary">Read the Spec</a>
    <a href="visualizer/" class="md-button">Visualizer</a>
    <a href="topics/" class="md-button">Learn More</a>
</div>


<style>
  /* Workflow steps styling */
  .workflow-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .workflow-step {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 0.8rem;
    background-color: var(--md-primary-fg-color--light);
    color: var(--md-primary-bg-color);
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .workflow-arrow {
    font-size: 1.5rem;
    color: var(--md-typeset-fg-color-light);
  }
  
  /* Button container styling */
  .button-container {
    text-align: center;
    margin-top: 1.5rem;
  }
  
  /* Override button colors to use WSO2 branding */
  .button-container .md-button--primary {
    background-color: #000000 !important;
    border-color: #000000 !important;
    color: #ffffff !important;
  }
  
  .button-container .md-button--primary:hover {
    background-color: #1a1a1a !important;
    border-color: #1a1a1a !important;
  }
  
  .button-container .md-button:not(.md-button--primary) {
    border: 2px solid #ff7300 !important;
    color: #ff7300 !important;
    background-color: transparent !important;
  }
  
  .button-container .md-button:not(.md-button--primary):hover {
    background-color: #ff7300 !important;
    color: #ffffff !important;
  }
</style>

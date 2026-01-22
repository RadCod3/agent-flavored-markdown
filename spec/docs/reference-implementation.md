# Ballerina Interpreter for AFM

A reference implementation that generates and runs AFM agents in [Ballerina](https://ballerina.io/). Available as a Docker image.

## Getting Started

Pull the image:

```bash
docker pull ghcr.io/wso2/afm-ballerina-interpreter:latest
```

Run an agent by mounting your `.afm.md` file and passing any required environment variables:

For example, where the `WSO2_MODEL_PROVIDER_TOKEN` is a required environment variable,

```bash
docker run -p 8085:8085 \
  -e WSO2_MODEL_PROVIDER_TOKEN=<your-token> \
  -v ./custom_agent.afm.md:/agent.afm.md \
  ghcr.io/wso2/afm-ballerina-interpreter:latest /agent.afm.md
```

## Supported Model Providers

Currently supports OpenAI, Anthropic, and the default WSO2 Model Provider.

To use the default WSO2 provider, set the `WSO2_MODEL_PROVIDER_TOKEN` environment variable — use the token generated via the **Ballerina: Configure default WSO2 model provider** VS Code command with the Ballerina plugin installed.

## Example

Create a simple webchat agent:

<div class="demo-code">
  <div class="demo-code-header">
    <span class="demo-file-name">friendly_assistant.afm.md</span>
  </div>
  <div class="demo-code-content">

```md
---
name: "Friendly Assistant"
description: "A friendly conversational assistant that helps users with various tasks."
version: "0.1.0"
license: "Apache-2.0"
interfaces:
  - type: webchat
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

Then run it:

```bash
docker run -p 8085:8085 \
  -e WSO2_MODEL_PROVIDER_TOKEN=<your-token> \
  -v ./friendly_assistant.afm.md:/agent.afm.md \
  ghcr.io/wso2/afm-ballerina-interpreter:latest /agent.afm.md
```

For console chat interfaces, include the `-it` options:

```bash
docker run -it -p 8085:8085 \
  -e WSO2_MODEL_PROVIDER_TOKEN=<your-token> \
  -v ./math_tutor.afm.md:/agent.afm.md \
  ghcr.io/wso2/afm-ballerina-interpreter:latest /agent.afm.md
```

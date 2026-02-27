---
hide:
  - navigation
---

# Reference Implementations

The following implementations can be used to run agents from AFM files. They are both interpreters that dynamically generate and run agents based on AFM files.

- Ballerina Interpreter for AFM - generates and runs [Ballerina](https://ballerina.io/) agents.
    - [Docker Image](https://github.com/wso2/reference-implementations-afm/pkgs/container/afm-ballerina-interpreter)
    - [Source](https://github.com/wso2/reference-implementations-afm/tree/main/ballerina-interpreter)

- LangChain-based Interpreter for AFM - generates and runs [LangChain](https://docs.langchain.com/oss/python/langchain/overview) agents.
    - [PyPI (afm-cli)](https://pypi.org/project/afm-cli/)
    - [Docker Image](https://github.com/wso2/reference-implementations-afm/pkgs/container/afm-langchain-interpreter)
    - [Source](https://github.com/wso2/reference-implementations-afm/tree/main/langchain-interpreter)

## Getting Started

### Via Docker

Pull an image to get started. For example,

```bash
docker pull ghcr.io/wso2/afm-ballerina-interpreter:latest
```

Run an agent by mounting your `.afm.md` file and passing required environment variables. 

For example, where `API_KEY` is a required environment variable:

```bash
docker run -p 8085:8085 \
  -e API_KEY=<YOUR-API-KEY> \
  -v ./support_agent.afm.md:/support_agent.afm.md \
  ghcr.io/wso2/afm-ballerina-interpreter:latest /support_agent.afm.md
```

### Via pipx (LangChain-based Interpreter)

Install the AFM CLI using pipx:

```bash
pipx install afm-cli
```

!!! Note
    `pipx` installs CLI tools in isolated environments and is the recommended approach on modern systems (Ubuntu 23.04+, Debian 12+, macOS with Homebrew Python, etc.), where `pip install` to the system Python may be blocked. See [pipx.pypa.io](https://pipx.pypa.io/) for installation instructions.

    If you are working inside an activated virtual environment, `pip install afm-cli` works as well.

Run an agent, setting any required environment variables beforehand:

```bash
export API_KEY=<YOUR-API-KEY>
afm run path/to/agent.afm.md
```

## Supported Model Providers

OpenAI, Anthropic, and the WSO2 provider (with the Ballerina Interpreter) are currently supported.

```yaml
model:
  provider: "<PROVIDER-NAME>" # "openai" or "anthropic"
  name: "<MODEL-NAME>"
  authentication:
    type: "api-key"
    api_key: "${env:API_KEY}" # Will look up an environment variable named `API_KEY`
```

!!! Note
    If the WSO2 model provider is used (with the Ballerina interpreter), the model does not have to be configured in the front matter. Just set the default model token as the `WSO2_MODEL_PROVIDER_TOKEN` environment variable. The token can be generated via the **Ballerina: Configure default WSO2 model provider** VS Code command with the Ballerina plugin installed.

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
model:
  provider: "openai"
  name: "${env:OPENAI_MODEL}"
  authentication:
    type: "api-key"
    api_key: "${env:OPENAI_API_KEY}"
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

=== "Docker"

    ```bash
    docker run -p 8085:8085 \
      -e OPENAI_MODEL=<YOUR-OPENAI-MODEL> \
      -e OPENAI_API_KEY=<YOUR-OPENAI-API-KEY> \
      -v ./friendly_assistant.afm.md:/friendly_assistant.afm.md \
      ghcr.io/wso2/afm-ballerina-interpreter:latest /friendly_assistant.afm.md
    ```

=== "Python / CLI"

    ```bash
    export OPENAI_MODEL=<YOUR-OPENAI-MODEL>
    export OPENAI_API_KEY=<YOUR-OPENAI-API-KEY>

    afm run friendly_assistant.afm.md
    ```

Access the chat UI at [`http://localhost:8085/chat/ui`](http://localhost:8085/chat/ui).

!!! Note Console chat interface
    When using Docker for console chat interfaces, include the `-it` options. For example, with the [math tutor](../examples/math_tutor/) file, use
    ```bash
    docker run -it -p 8085:8085 \
      -e OPENAI_MODEL=<YOUR-OPENAI-MODEL> \
      -e OPENAI_API_KEY=<YOUR-OPENAI-API-KEY> \
      -v ./math_tutor.afm.md:/math_tutor.afm.md \
      ghcr.io/wso2/afm-ballerina-interpreter:latest /math_tutor.afm.md
    ```

!!! Note Getting Started Template
    You can use the [Getting Started Template](https://github.com/wso2/reference-implementations-afm/blob/main/templates/agent_template.afm.md) to get started.

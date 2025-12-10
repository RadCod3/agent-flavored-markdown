---
title: Specification
description: The AFM specification defines a structured, markdown-based format for AI agents, enabling easy sharing, deployment, and understanding across platforms.
hide:
  - navigation
---

# AFM Specification v0.3.0

## 1. Introduction

AFM (Agent Flavored Markdown) provides a structured, markdown-based format for defining the capabilities, behaviors, and knowledge of AI agents. The goal is to create a universal standard that allows agents to be easily defined, shared, and deployed.

AFM is designed to be composable. It supports not only the definition of individual agents but also complex, multi-agent systems where agents can expose services for other agents to consume.

This document details the AFM file format, its syntax, and the schema for defining an agent.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [[RFC2119](https://datatracker.ietf.org/doc/html/rfc2119)] [[RFC8174](https://datatracker.ietf.org/doc/html/rfc8174)] when, and only when, they appear in all capitals, as shown here.


### 1.1. Key Goals of AFM

AFM addresses the current fragmentation in the AI agent ecosystem by providing a unified standard for agent definition and interoperability:

- **Simple Syntax**: Move away from complex, imperative code. AFM allows developers to *declare* an agent's properties, tools, and configurations in a simple, text-based format.
- **Human-Readability**: AFM uses a simple, elegant markdown-based syntax that is intuitive for both developers and non-technical stakeholders to read, write, and understand.
- **Adaptable**: AFM is designed to be flexible and extensible, allowing the standard to evolve as AI technologies and requirements change.
- **Unified Experience**: Provide a clean, declarative model that works seamlessly for both developers writing code and those using visual, low-code interfaces. The same AFM file can power both experiences.
**Agent Duality**: Natively support the dual nature of agents as both callable functions (e.g., within an application or as a scheduled task) and as exposable services (e.g., chat agents) for interoperability.
- **Interoperability**: AFM provides a standard, unambiguous syntax for agent definition, ensuring that diverse platforms and tools can consistently use the same agent blueprint.


## 2. Core Concepts

AFM is built around several core concepts that define how agents are structured and interact:

- **Agent**: The primary entity defined in AFM, representing an AI agent with specific capabilities and behaviors.
- **Role**: The set of responsibilities or tasks an agent is designed to perform, described in clear, natural language to define its purpose within a given context.
- **Instructions**: Explicit, natural language directives that shape the agent's behavior and guide its actions, typically forming the core of the system prompt.
- **Agent Details**: Programmatic metadata that describes the agent, including name, version, author, and other identifying information.
- **Tools**: External tools and services available to the agent (via MCP).
- **Interface**: Specifications for how agents expose themselves to the outside world, defining their callable signature and service endpoints.

## 3. File Format and Content

An agent definition file must use the `*.afm.md` or `.afm` extension. 

The filename (without extension) serves as the **Agent Identifier** - a unique identifier for the agent within its [namespace](#field-namespace). This identifier is **REQUIRED**.

**Agent Identifier Rules:**

- The identifier **MUST NOT** start with special characters, numbers, or whitespace.
- It **MUST** be unique within its namespace to avoid conflicts.

The file content must be encoded in UTF-8.

!!! tip "Recommendation for Naming AFM Files"
  When naming your AFM files, it is **RECOMMENDED** to:
  
  - Use lowercase letters and numbers, with hyphens to separate words.
  - Avoid spaces and special characters to ensure compatibility across different systems.

## 4. Syntax Overview

### 4.1. Basic Structure

An AFM file is structured into two main sections: the front matter and the agent declaration.

* **Front Matter**: Contains metadata about the agent.
* **Markdown Body**: Contains the agent's definition.

### 4.2. Front Matter

The front matter is a YAML block at the top of the file, enclosed by `---` lines. Refer to the [YAML specification](https://yaml.org/spec/1.2/spec.html) for more details on YAML syntax.

This section contains metadata about the agent. These metadata fields are **OPTIONAL** and can be used to provide additional context or configuration for the agent.

| Section           | Description                                                                      |
| ----------------- | -------------------------------------------------------------------------------- |
| [Agent Details](#51-about-the-agent)     | Information about the agent, such as its name, description, version, and author. |
| [Agent Model](#52-agent-model)   | Defines the AI model that powers the agent, including endpoint and authentication. |
| [Agent Interface](#53-agent-interface)   | Defines how the agent is invoked and its input/output signature.                 |
| [Agent Tools](#54-tools) | Defines external tools available to the agent (e.g., via MCP).                  |
| [Agent Execution](#55-agent-execution) | Runtime execution control settings like iteration limits. |

Refer to the [AFM Schema](#5-schema-definitions) for a complete list of fields and their meanings.


### 4.3.  Markdown Body

This section contains the detailed, natural language instructions that guide the agent's behavior.

Users can use markdown syntax to format the text, including headings, lists, links, and code blocks.

The Markdown body **SHOULD** contain the following headings, with corresponding content

 - `# Role`: A description of the agent's role.
 - `# Instructions`: The explicit, natural language directives that define the agent's behavior, capabilities, and operational guidelines.

### 4.4. Example

!!! example "Basic AFM File Example"
    Here is a simple example of an AFM file:

    ```yaml
    ---
    spec_version: "0.3.0"
    name: "Math Tutor"
    description: "An AI assistant that helps with mathematics problems"
    version: "1.0.0"
    namespace: "education"
    authors:
      - "Jane Smith <jane@example.com>"
    license: "MIT"
    ---

    # Role
    The Math Tutor is an AI agent designed to assist students with mathematics problems, providing explanations, step-by-step solutions, and practice exercises.

    # Instructions
    - Use clear and concise language when explaining concepts.
    - Provide examples to illustrate complex ideas.
    - Encourage students to think critically and solve problems independently.
    - Answer questions about mathematical concepts
    - Solve equations and provide step-by-step solutions
    - Generate practice problems and quizzes when requested
    - Provide explanations and tips for solving math problems
    ```

## 5. Schema Definitions

This section defines the schema for the Front Matter. For clarity, the schema is divided into several subsections, each detailing a specific aspect of the Agent.

### 5.1. About the Agent {#51-about-the-agent} 

This section defines the schema for agent-specific metadata. It is **OPTIONAL** but recommended for clarity and organization.

AFM implementations **SHALL** use this section to display the agent's metadata in user interfaces to provide better user experience for end users.

#### 5.1.1. Schema Overview

The agent metadata fields are specified in the YAML frontmatter of an AFM file:

```yaml
# Agent metadata schema
spec_version: string   # AFM specification version (e.g., "0.3.0")
name: string           # The name of the agent
description: string    # Brief description of the agent's purpose and functionality
version: string        # Semantic version (e.g., "1.0.0")
namespace: string      # Logical grouping category for the agent
author: string         # Single author in format "Name <Email>"
authors:               # Takes precedence over the 'author' field if both exist
  - string             # Multiple authors, each in format "Name <Email>"
provider: object       # Agent provider
  organization: string # Name of the organization
  url: string          # URL to the organization's website
iconUrl: string        # URL to an icon representing the agent
license: string        # License under which the agent is released
```

#### 5.1.2. Field Definitions {#agent-field-definitions}

Each field serves a specific purpose in defining and organizing the agent:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| <a id="field-spec-version"></a>[`spec_version`](#field-spec-version) | `string` | No | Version of the AFM specification this file conforms to (e.g., "0.3.0").<br>This is **OPTIONAL** but recommended for forward compatibility.<br>AFM implementations **MAY** use this field to validate compatibility and provide warnings for mismatched spec versions. |
| <a id="field-name"></a>[`name`](#field-name) | `string` | No | Identifies the agent in human-readable form.<br>Default: inferred from the filename of the AFM file.<br>AFM implementations **SHALL** use this field to display the agent's name in user interfaces. |
| <a id="field-description"></a>[`description`](#field-description) | `string` | No | Provides a concise summary of what the agent does.<br>Default: inferred from the markdown body `# Role` section.<br>AFM implementations **SHALL** use this field to display the agent's description in user interfaces. |
| <a id="field-version"></a>[`version`](#field-version) | `string` | No | [Semantic version](https://semver.org/) of the agent definition (MAJOR.MINOR.PATCH).<br>Default: "0.0.0".<br>AFM implementations **SHALL** use this field to display the agent's version in user interfaces. |
| <a id="field-namespace"></a>[`namespace`](#field-namespace) | `string` | No | Logical grouping category for the agent.<br>Default: "default".<br>AFM implementations **SHALL** use this field to organize agents into logical groups or categories. |
| <a id="field-author"></a>[`author`](#field-author) | `string` | No | Single author in format `Name <Email>`.<br>Credits the creator of the agent definition. If both `author` and `authors` fields are provided, `authors` takes precedence. |
| <a id="field-authors"></a>[`authors`](#field-authors) | `string[]` | No | Multiple authors, each in format `Name <Email>`.<br>Credits the creators of the agent definition. Takes precedence over `author` if both exist. |
| <a id="field-iconurl"></a>[`iconUrl`](#field-iconurl) | `string` | No | URL to an icon representing the agent.<br>This is **OPTIONAL** but recommended for visual representation in user interfaces.<br>AFM implementations **SHALL** use this field to display the agent's icon in user interfaces. |
| <a id="field-provider"></a>[`provider`](#field-provider) | `object` | No | Information about the organization providing the agent.<br>This is **OPTIONAL** but recommended for attribution.<br>See the [Provider Object](#provider-object) below for details. |
| <a id="field-license"></a>[`license`](#field-license) | `string` | No | License under which the agent definition is released.<br>This is **OPTIONAL** but recommended for clarity. |

**<a id="provider-object"></a>Provider Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| <a id="field-provider-organization"></a>[`provider.organization`](#field-provider-organization) | `string` | No | Name of the organization providing the agent. |
| <a id="field-provider-url"></a>[`provider.url`](#field-provider-url) | `string` | No | URL to the organization's website. |

#### 5.1.3. Example Usage

The following example demonstrates a valid agent metadata section as specified in [Section 5.1.1](#51-about-the-agent). This YAML front matter illustrates the use of recommended and optional fields for agent definition:

```yaml
---
spec_version: "0.3.0"
name: "Math Tutor"
description: "An AI assistant that helps with mathematics problems"
version: "1.2.0"
namespace: "education"
authors:
  - "Jane Smith <jane@example.com>"
  - "John Doe <john@example.com>"
provider:
  organization: "Example AI Solutions"
  url: "https://example.com"
iconUrl: "https://example.com/icons/math-tutor.png"
license: "MIT"
---
```


### 5.2. Agent Model {#52-agent-model}

This section specifies the AI model or language model that powers the agent. It is **OPTIONAL** and defines how to access and authenticate with the model service.

#### 5.2.1. Field Definitions

| Field            | Type     | Required | Description                                                                 |
|------------------|----------|----------|-----------------------------------------------------------------------------|
| `name`           | `string` | No       | Model identifier or name (e.g., "claude-3-sonnet-20240229", "gpt-4"). |
| `url`            | `string` | No       | The URL endpoint for the model service. |
| `authentication` | `object` | No       | Authentication configuration for accessing the model. See [Section 5.6](#56-authentication) for the schema. |

#### 5.2.2. Schema Overview

```yaml
model:
  name: string             # Optional model name or identifier
  url: string              # Optional model service endpoint URL
  authentication: object   # Optional authentication configuration
```

#### 5.2.3. Example Usage

**API-based model:**
```yaml
model:
  url: "https://api.anthropic.com/v1/messages"
  authentication:
    type: "api_key"
    key: "${ANTHROPIC_API_KEY}"
```

**Named model:**
```yaml
model:
  name: "claude-3-sonnet-20240229"
  authentication:
    type: "api_key"
    key: "${ANTHROPIC_API_KEY}"
```

**Model with both name and URL:**
```yaml
model:
  name: "gpt-4-turbo"
  url: "https://api.openai.com/v1/chat/completions"
  authentication:
    type: "bearer"
    token: "${OPENAI_API_KEY}"
```


### 5.3. Agent Interface {#53-agent-interface}

This section defines how an agent can be interacted with or triggered. It includes the agent's public API, function signature, or service endpoint. It is **OPTIONAL** and specifies how the agent receives inputs and produces outputs.

If the `interface` field is not explicitly defined in the front matter, AFM implementations **MUST** assume a default interface of type `function`. In this default mode, the agent **SHALL** be invoked as a stateless, single-invocation callable: it **MUST** accept a single string input and **MUST** produce a single string output. After processing the input, the agent **SHALL** complete execution and return the output.

Users can override these defaults by specifying the `interface` field in the front matter. AFM implementations **SHALL** use this definition to generate the agent's callable interface and to ensure consistent behavior across different platforms.

#### 5.3.1. Interface Types

The `interface.type` field **MUST** be one of the following values:

| Value      | Description                                                                                                         |
|------------|---------------------------------------------------------------------------------------------------------------------|
| `function` | The agent is invoked as a callable function, which could be called within an application, as a scheduled task, etc. |
| `service`  | The agent is exposed as a network-accessible service (e.g., REST API).                                              |
| `chat`     | The agent is optimized for conversational use, with string input/output (e.g., chatbots).                           |
| `webhook`  | The agent is exposed as a webhook endpoint and supports subscription details (e.g., WebSub hub integration).        |

Each interface type defines how the agent is triggered and interacted with. Implementations **MAY** support all four types as described above.

#### 5.3.2. Schema Overview

```yaml
interface:
  type: function | service | chat | webhook
  signature:
    input: object      # JSON Schema object defining input parameters
    output: object     # JSON Schema object defining output parameters
  # Optional, depending on type:
  exposure:              # For service/chat/webhook types
    http: object         # Configuration for exposing as an HTTP endpoint.
  subscription:          # For webhook type
    protocol: string     # e.g., "websub"
    hub: string          # Subscription hub URL
    topic: string        # Topic to subscribe to
    callback: string     # Callback URL for receiving events (optional, for dynamic registration)
    secret: string       # Secret for verifying webhook payloads (optional)
```

#### 5.3.3. Field Definitions

| Field         | Type     | Required | Description                                                                                             |
|---------------|----------|----------|---------------------------------------------------------------------------------------------------------|
| `type`        | `string` | Yes      | The agent's interface type. Must be one of:<br>- `function`: Invoked as a callable function (e.g., within an application or as a scheduled task).<br>- `service`: Network-accessible agent.<br>- `chat`: Conversational agent (string input/output).<br>- `webhook`: Service with subscription support. |
| `signature`   | `object` | Yes      | Defines the agent's input and output parameters. See [Signature Object](#signature-object).                  |
| `exposure`    | `object` | No       | Configuration for how a `service`, `chat`, or `webhook` agent is exposed. See [Exposure Object](#exposure-object).                |
| `subscription`| `object` | No       | (webhook only) Subscription configuration. See below. |

##### Signature Object {#signature-object}

Defines the data contract for the agent. The `input` and `output` fields MUST conform to the [JSON Schema](https://json-schema.org/) specification, but MAY be expressed in YAML syntax (as is common in OpenAPI and similar specifications). This allows for:

- Simple signatures (e.g., a single string, number, boolean, or array)
- Complex, structured objects with named properties
- Full expressiveness of JSON Schema for validation and documentation

**Examples:**

*Single string input/output (default):*
```yaml
signature:
  input:
    type: string
  output:
    type: string
```

*Complex object with properties:*

When `input` or `output` is an object type, it is RECOMMENDED to document the properties using a table with the following columns:

| Name | Type | Description | Required |
|------|------|-------------|----------|
| property name | JSON Schema type | Description of the property | true/false |

This table maps directly to the `properties`, `type`, `description`, and `required` fields in JSON Schema. For example:

```yaml
signature:
  input:
    type: object
    properties:
      user_prompt:
        type: string
        description: "The user's query or request"
      context:
        type: object
        description: "Additional context for the request"
    required: [user_prompt]
  output:
    type: object
    properties:
      response:
        type: string
        description: "The agent's response to the user prompt"
      confidence:
        type: number
        description: "Confidence score for the response"
    required: [response]
```

*Array input/output:*
```yaml
signature:
  input:
    type: array
    items:
      type: string
  output:
    type: array
    items:
      type: string
```

**Default Behavior:**

Default signature behavior:
- For `function`, `chat`, and `service` types: the default `signature` is string input and string output.
- For `webhook` type: the `input` field MAY be omitted, as the webhook provider determines the input payload structure.

AFM implementations **SHALL** use this definition to generate the agent's callable interface and to ensure consistent behavior across different platforms.

**Subscription Object (webhook only):**

| Field            | Type     | Required | Description |
|------------------|----------|----------|-------------|
| `protocol`       | `string` | Yes      | The subscription protocol (e.g., `websub`). |
| `hub`            | `string` | Yes      | The subscription hub URL. |
| `topic`          | `string` | Yes      | The topic to subscribe to. |
| `callback`       | `string` | No       | The callback URL where events should be delivered (optional, for dynamic or self-registration). |
| `authentication` | `object` | No       | Optional authentication configuration for the webhook subscription. See [Section 5.6](#56-authentication) for the schema. |
| `secret`         | `string` | No       | A secret used to sign or verify webhook payloads (optional, for security). |

##### Exposure Object {#exposure-object}

Applies to agents of type `service`, `chat`, and `webhook`, and defines how the corresponding services are exposed.

| Field  | Type     | Required | Description                                                          |
|--------|----------|----------|----------------------------------------------------------------------|
| `http` | `object` | No | Defines how to expose the agent via a standard HTTP endpoint.        |

!!! warning "WIP"
    Work in progress

**HTTP Object:**

| Field            | Type     | Required | Description                                                                 |
|------------------|----------|----------|-----------------------------------------------------------------------------|
| `path`           | `string` | Yes      | The URL path segment for the agent's HTTP endpoint (e.g., `/math-tutor`). |
| `authentication` | `object` | No       | Optional authentication configuration for the HTTP endpoint. See [Section 5.6](#56-authentication) for the schema. |

!!! note "HTTP Object Usage"
    The `http` object is applicable for agents of type `service`, `chat`, or `webhook`. It defines how the agent is exposed via a standard HTTP endpoint, allowing other systems to interact with it over the web.

    AFM does not define the HTTP methods (GET, POST, etc.) for the agent's endpoint. This is left to the implementation to decide based on the agent's functionality and requirements.
    
    HTTP authentication uses the generic authentication schema defined in [Section 5.6](#56-authentication), where the `type` field specifies the authentication scheme (e.g., `oauth2`, `api_key`), and the rest of the fields provide the configuration.


#### 5.3.4. Example Usages

**Function agent (default simple string):**
```yaml
interface:
  type: function
  signature:
    input:
      type: string
    output:
      type: string
```

**Function agent (custom with structured input/output):**
```yaml
interface:
  type: function
  signature:
    input:
      type: object
      properties:
        user_prompt:
          type: string
          description: "The user's query or request"
        context:
          type: object
          description: "Additional context for the request"
      required: [user_prompt]
    output:
      type: object
      properties:
        response:
          type: string
          description: "The agent's response to the user prompt"
        confidence:
          type: number
          description: "Confidence score for the response"
      required: [response]
```

**Service agent:**
```yaml
interface:
  type: service
  signature:
    input:
      type: object
      properties:
        user_prompt:
          type: string
          description: "The user's query or request"
        context:
          type: object
          description: "Additional context for the request"
      required: [user_prompt]
    output:
      type: object
      properties:
        response:
          type: string
          description: "The agent's response to the user prompt"
        confidence:
          type: number
          description: "Confidence score for the response"
      required: [response]
  exposure:
    http:
      path: "/research-assistant"
```

**Chat agent:**
```yaml
interface:
  type: chat
  signature:
    input:
      type: object
      properties:
        message:
          type: string
          description: "The user's chat message"
      required: [message]
    output:
      type: object
      properties:
        reply:
          type: string
          description: "The agent's chat reply"
      required: [reply]
  exposure:
    http:
      path: "/chatbot"
```

**Webhook agent:**
```yaml
interface:
  type: webhook
  signature:
    input:
      type: object
      properties:
        event:
          type: string
          description: "The event type received by the webhook"
        payload:
          type: object
          description: "The event payload"
      required: [event, payload]
    output:
      type: object
      properties:
        result:
          type: string
          description: "The agent's response to the webhook event"
      required: [result]
  subscription:
    protocol: "websub"
    hub: "https://example.com/websub-hub"
    topic: "https://example.com/events/agent"
    callback: "https://myagent.example.com/webhook-callback"
    secret: "${WEBHOOK_SECRET}"
  exposure:
    http:
      path: "/webhook-handler"
```

### 5.4. Tools {#54-tools}

This section defines which external tools and resources the agent can access.

#### 5.4.1. Schema Overview

The tools fields are specified in the YAML frontmatter of an AFM file:

```yaml
tools:
  mcp: object         # Configuration for connecting to MCP tools.
```

#### 5.4.2. Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tools` | `object` | No | Container for protocol-specific tool connection configurations. |
| `tools.mcp` | `object` | No | Configuration for Model Context Protocol. See [Section 6.1](#61-model-context-protocol-mcp) for details. |

**MCP Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `servers` | `array` | Yes | List of MCP servers to connect to. See [Section 6.1](#61-model-context-protocol-mcp) for detailed schema. |

#### 5.4.3. Example Usage

Here's a simple example of tools in an AFM file:

```yaml
tools:
  mcp:
    servers:
      - name: "github_api"
        transport:
          type: "http_sse"
          url: "https://mcp.github.com/api"
```

<!-- ### 5.4. Agent Resources

This section defines the schema for resources that an agent can access or utilize from the implementation environment. These resources can be models, memory or other data sources that the agent can leverage to perform its tasks.

This section is **OPTIONAL**. 

!!! warning "WIP"
    Work in progress: The schema for agent resources is still under development. This section will be updated in future versions of the AFM specification. -->

### 5.5. Agent Execution {#55-agent-execution}

This section defines execution control and runtime behavior settings for the agent. These settings are **OPTIONAL** and help AFM implementations manage agent execution safely and efficiently.

#### 5.5.1. Schema Overview

```yaml
max_iterations: int    # Maximum number of iterations to prevent infinite loops
```

#### 5.5.2. Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| <a id="field-max-iterations"></a>[`max_iterations`](#field-max-iterations) | `integer` | No | Maximum number of iterations the agent can perform in a single invocation.<br>This helps prevent infinite loops or runaway execution.<br>Default: Implementation-specific (typically unlimited or a high value like 100).<br>AFM implementations **SHOULD** respect this limit and gracefully terminate agent execution when the limit is reached. |

#### 5.5.3. Example Usage

```yaml
max_iterations: 50
```

### 5.6. Authentication {#56-authentication}

This section defines the generic client authentication schema that can be reused across different parts of the AFM specification, including MCP server connections and webhook subscriptions.

The authentication object is **OPTIONAL** and specifies authentication configuration for connections.

#### 5.6.1. Schema Overview

```yaml
authentication:
  type: string         # Authentication scheme (bearer, jwt, oauth2, api_key, basic, etc.)
  # Additional fields depend on the type
  # Examples:
  # - For bearer: token
  # - For basic: username, password
  # - For oauth2: a grant_type field and client_id, client_secret, token_url, etc.
```

#### 5.6.2. Field Definitions

<a id="authentication-object"></a>**Authentication Object:**

| Key    | Type   | Required | Description                                                                                                                                                    |
| ------ | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type` | String | Yes      | Authentication scheme (e.g., `bearer`, `jwt`, `oauth2`, `basic`).<br>Determines which additional fields are required or supported. |
| `*`    | Various | Varies   | Additional fields are authentication-type specific. See examples below for common patterns.<br>Values **SHOULD** use [variable substitution](#7-variable-substitution) to reference credentials securely. |

!!! note "Authentication Field Structure"
    The authentication object uses a type-specific structure where the `type` field determines which additional fields are needed:
    
    - **bearer**: Requires `token` field
    - **basic**: Requires `username` and `password` fields
    - **oauth2**: May require a `grant_type` field and fields like `client_id`, `client_secret`, `token_url`, `scope`, etc.
    
    The exact set of fields and their semantics are implementation-specific, but implementations **SHOULD** follow common authentication patterns for each type.

!!! warning "Security Best Practices"
    Sensitive credentials (tokens, passwords, secrets, keys) **SHOULD NOT** be hardcoded in AFM files. Instead:
    
    - Use [variable substitution](#7-variable-substitution) to reference credentials from secure sources
    - Let the agent's host environment manage actual credential storage and retrieval
    - Keep credentials out of version control systems

#### 5.6.3. Example Usage

```yaml
# Bearer token authentication
authentication:
  type: bearer
  token: "${API_TOKEN}"

# Basic authentication
authentication:
  type: basic
  username: "${API_USERNAME}"
  password: "${API_PASSWORD}"

# OAuth2 authentication
authentication:
  type: oauth2
  client_id: "${OAUTH_CLIENT_ID}"
  client_secret: "${OAUTH_CLIENT_SECRET}"
  token_url: "https://auth.example.com/oauth/token"
  scope: "read:data write:data"
```

## 6. Protocol Extensions

This section provides detailed specifications for the protocols referenced in above schema. These protocols enable agents to communicate with external systems and other agents.

### 6.1. Model Context Protocol (MCP)

The Model Context Protocol (MCP) enables agents to connect to external tools and data sources.

#### 6.1.1. Schema Overview

```yaml
mcp:
  servers:
    - name: string           # Unique identifier for the server connection
      transport:
        type: string         # Transport mechanism (http_sse, stdio, streamable_http)
        url: string          # URL endpoint (for http_sse and streamable_http)
        command: string      # Shell command (for stdio)
      authentication:        # Optional
        type: string         # Authentication scheme (bearer, jwt, oauth2, etc.)
      tool_filter:           # Optional
        allow: [string]      # Whitelist of tools in "tool_name" format
        deny: [string]       # Blacklist of tools in "tool_name" format
```

#### 6.1.2. Field Definitions

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `servers` | Array | Yes | Specifies the MCP servers that the agent can connect to. Each server entry must have a unique `name` that identifies the connection. |

**Server Object:**

| Key              | Type   | Required | Description                                                                                                        |
| ---------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `name`           | String | Yes      | A unique, human-readable identifier for the connection.                                                            |
| `transport`      | Object | Yes      | An object defining the communication mechanism. See [Transport Object](#transport-object) below.                   |
| `authentication` | Object | No       | An object declaring the required authentication scheme. See [Section 5.6](#56-authentication) for the schema. |
| `tool_filter`    | Object | No       | Filter configuration for tools from this server. See [Tool Filter Object](#tool-filter-object) below.              |

**<a id="transport-object"></a>Transport Object:**

| Key       | Type   | Required       | Description                                                                                                                                                                                               |
| --------- | ------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`    | String | Yes            | Transport mechanism, which must be one of:<br>- `http_sse`: Server-Sent Events over HTTP<br>- `stdio`: Standard input/output for local processes<br>- `streamable_http`: HTTP with streaming capabilities |
| `url`     | String | For HTTP types | The URL endpoint of the remote MCP server.                                                                                                                                                                |
| `command` | String | For stdio      | The shell command used to start the local MCP server process.                                                                                                                                             |

**<a id="tool-filter-object"></a>Tool Filter Object:**

| Key     | Type         | Required | Description                                                        |
| ------- | ------------ | -------- | ------------------------------------------------------------------ |
| `allow` | String Array | No       | A whitelist of tools to expose from this server, using just the tool name (e.g., `create_issue`, `read_file`). If specified, only these tools are available. |
| `deny`  | String Array | No       | A blacklist of tools to hide from this server, using just the tool name (e.g., `write_file`). Applied after `allow` filtering. |

!!! note "Filter Precedence"
    When both `allow` and `deny` are specified:
    1. First, if `allow` is present, only the tools in the allow list are made available
    2. Then, `deny` is applied to remove specific tools from that filtered set
    If only `deny` is specified, all tools from the server are available except those in the deny list.

#### 6.1.3. Example Implementation

This example defines tool connections to a remote GitHub MCP server (requiring OAuth 2.0) and a local filesystem server. Each server has its own tool filter configuration. Note the use of [variable substitution](#7-variable-substitution) for sensitive and/or variable input.

```yaml
tools:
  mcp:
    servers:
      - name: github_mcp_server
        transport:
          type: http_sse
          url: "${GITHUB_MCP_URL}"
        authentication:
          type: bearer
          token: "${GITHUB_OAUTH_TOKEN}"
        tool_filter:
          allow:
            - "issues.create"
            - "repos.list"

      - name: local_filesystem_server
        transport:
          type: stdio
          command: "npx -y @modelcontextprotocol/server-filesystem ${WORKSPACE_PATH}"
        tool_filter:
          allow:
            - "read_file"
            - "list_directory"
            - "stat"
          deny:
            - "write_file"
            - "delete_file"
            - "create_file"
```

### 6.2. Agent-to-Agent (A2A)

!!! warning "Coming Soon"
    The Agent-to-Agent Protocol (A2A) specification for exposing agents as discoverable services is under development and will be available in a future version of AFM.

## 7. Variable Substitution

AFM files MAY use `${...}` syntax for variable substitution. The timing of variable resolution is implementation-defined.

The content within `${...}` is also implementation-defined and implementations are responsible for determining how and when variables are resolved, including handling prefix conventions (e.g., `${env:VAR}`, `${file:KEY}`).

Variable resolution commonly occurs before the agent is made available for use, but MAY also happen at other stages depending on the implementation.

### 7.1. Example Usage

```yaml
authentication:
  type: "bearer"
  token: "${API_TOKEN}"
transport:
  url: "${BASE_URL}/mcp/v1"
```

Implementations MAY adopt and support prefixes. E.g.,

```yaml
token: "${env:API_TOKEN}" # Environment variable
url: "${file:api.baseUrl}" # From external config file
password: "${secret:DB_PASSWORD}" # From secrets manager
```

## 8. Future Work

This section outlines potential future enhancements to the AFM specification, including:

- Exposing agents via the Agent-to-Agent (A2A) protocol.
- Specifying the Large Language Model (LLM) configuration for agents.

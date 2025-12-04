# AFM: The Blueprint for a Connected Agent

In the rapidly expanding universe of AI, building a powerful agent is only the beginning. The true challenge lies in making that agent a functional part of a larger ecosystem. This requires clear standards for what an agent is, what tools it can use, and how it collaborates. While protocols like the **Model Context Protocol (MCP)** provide a "toolbox" for agents and the **Agent-to-Agent (A2A) Protocol** provides the "communication channel," **Agent Flavored Markdown (AFM)** is the blueprint that connects the agent's definition to these powerful capabilities.

An AFM file's role extends far beyond a simple description; it is the central configuration layer that activates an agent's ability to interact with the world. This is achieved through the `tools` block (for MCP tools) and the `interface` block (for A2A exposure) within the AFM front matter—simple yet powerful sections that transform a static definition into a dynamic, enabled entity.

<div class="grid cards" markdown>

-   :material-tools: **MCP: The Toolbox**
    
    Gives agents access to external tools and services, expanding their capabilities beyond conversation.

-   :material-message-text: **A2A: The Communication Channel**
    
    Enables agents to discover and collaborate with each other, sharing tasks and information.

</div>

## Equipping Agents with Tools via MCP

An agent's utility is measured by what it can do. AFM specifies this by declaring which MCP servers the agent is authorized to use.

Within the `tools.mcp` section, an AFM file lists the specific MCP tool servers the agent can access. This could be a connection to a GitHub API, a local filesystem, or a corporate database.

```yaml
# In an AFM file...
tools:
  mcp:
    servers:
      - name: github_api_server
        transport:
          type: http_sse
          url: "https://mcp.github.com/api"
      - name: local_file_system
        transport:
          type: stdio
```

<div class="grid" markdown>

<div class="grid__col" markdown>
### What AFM Provides

- Declarative tool configuration
- Authorization boundaries
- Transport specifications
- Tool filtering capabilities
</div>

<div class="grid__col" markdown>
### Benefits

- **Zero Code Changes**: Modify tools without changing runtime code
- **Clear Boundaries**: Explicitly define what an agent can and cannot access
- **Portable Configuration**: The same definition works across implementations
</div>

</div>

By defining these tool connections, the AFM file does more than describe an agent; it **equips it**. It hands the agent its specific toolkit, making it instantly capable of performing tasks like creating a GitHub issue or reading a local file. This declarative approach means you can change an agent's tools and capabilities simply by editing its AFM file, without touching a line of runtime code.

## Making Agents Collaborative with A2A

!!! warning "Coming Soon"
    The A2A protocol integration for agent collaboration is under development and will be available in a future version of the AFM specification.

## The Complete Picture

<div class="grid" markdown>

<div class="grid__col" markdown>
### From Static to Dynamic

AFM transforms a static agent description into a dynamic, connected entity that can:

- Access specific tools through MCP
- Collaborate with other agents through A2A
- Maintain clear boundaries and permissions
</div>

<div class="grid__col" markdown>
### Practical Benefits

- **Composability**: Build complex systems from simple components
- **Flexibility**: Change tool connections and exposure without changing code
- **Transparency**: Clear documentation of an agent's capabilities
</div>

</div>

By serving as the declarative bridge to both MCP and A2A, AFM provides the essential configuration that brings an agent to life. It is the practical, portable blueprint that takes an agent from a standalone concept to a fully-connected participant in a modern AI ecosystem.

<style>
.grid__col {
  padding: 1rem;
  background-color: var(--md-code-bg-color);
  border-radius: 0.5rem;
}
</style>

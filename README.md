# Agent-Flavored Markdown (AFM)

A Markdown-based format for portable definitions of AI agents using natural language.

## What is AFM?

AFM (Agent-Flavored Markdown) is an open specification for defining AI agents in a simple, declarative, Markdown-based format. Instead of writing framework-specific code to configure agents, you write Markdown with structured YAML front matter.

Most AI agent frameworks intertwine agent instructions with technical configurations, obscuring the core agent logic and making it difficult to migrate between platforms. AFM addresses this by cleanly separating natural language instructions from configuration, making agent definitions portable across tools and frameworks.

**Key benefits:**

- **Portable** - Framework-agnostic definitions that work across different platforms, reducing migration complexity as the AI ecosystem evolves
- **Clear** - Separates natural language instructions from configuration, making the agent's core logic easy to understand
- **Natural** - Markdown's human-readable format is a natural fit for natural language instructions, optionally leveraging Markdown formatting for headings, lists, code blocks, etc.
- **Accessible** - Markdown's familiarity lets domain experts author agents without deep technical knowledge
- **Collaborative** - Instructions and configuration can be developed independently without interfering with each other

## Quick Example

```yaml
---
name: "Friendly Assistant"
description: "A friendly conversational assistant that helps users with various tasks."
version: "0.1.0"
license: "Apache-2.0"
interfaces:
  - type: "webchat"
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

For more, see [Examples](https://wso2.github.io/agent-flavored-markdown/examples/).

## Specification

Read the [full specification](https://wso2.github.io/agent-flavored-markdown/specification/).

## Citation

If you use AFM in your research, please cite:

```bibtex
@inproceedings{mohamed2026afm,
  title={Agent-Flavored Markdown: Natural Language Specifications for Framework-Agnostic Agent Development},
  author={{Ziyad Mohamed}, Maryam and Aravinda, Hasitha and Khalaf, Rania},
  booktitle={Joint Proceedings of the ACM Intelligent User Interfaces (IUI) Workshops 2026},
  year={2026},
  month={March},
  address={Paphos, Cyprus},
  note={To appear}
}
```

## Contributing

### Repository Structure

- `spec/docs/specification.md` - The AFM Specification (core document)
- `spec/docs/` - Additional documentation and guides
- `spec/mkdocs.yml` - Documentation site configuration

### Local Development

**Prerequisites:** Python 3.12+

```bash
pip install -r spec/requirements.txt
cd spec && mkdocs serve
```

Open [http://localhost:8000](http://localhost:8000) to view the documentation site.

### Docker Development

```bash
docker build -t afm-spec spec/
docker run --rm -p 8000:8000 afm-spec
```

### Building for Production

```bash
cd spec && mkdocs build
```

Output will be in the `site/` directory.

## License

See [LICENSE.md](LICENSE.md) for details.

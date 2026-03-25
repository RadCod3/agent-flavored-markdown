# Code Explainer — Sample

An AFM agent that helps users understand codebases. Point it at any project directory and ask questions about the code via the console chat interface (`consolechat`). It reads source files, traces execution flows, and provides clear explanations grounded in the actual code.

## Structure

```
code-explainer/
└── code_explainer.afm.md    # Agent definition
```

## What it demonstrates

- Console chat interface (`consolechat`)
- Multiple MCP servers working together (filesystem + sequential-thinking)
- stdio MCP transport with official MCP servers
- Environment variable substitution for the project directory
- A read-oriented agent that explores and explains without modifying files

## Environment variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `PROJECT_DIR` | Path to the project directory to explore |

## Test scenarios

### 1. Project overview

**Prompt:** "What does this project do? Give me a high-level overview."

The agent lists the directory structure and reads key files (README, entry points, config) to provide a concrete summary of what the project does — not just a list of filenames.

### 2. Explain a specific file

**Prompt:** "Explain what src/auth.py does."

The agent reads the file and explains its purpose, functions, inputs, outputs, and how it fits into the project.

### 3. Trace a flow

**Prompt:** "How does a user login request flow through the code?"

The agent searches for the relevant entry point, reads each file in the call chain, and walks through the request path step by step with file names and line numbers.

### 4. Locate and explain a feature

**Prompt:** "Where is the database connection configured and how does it work?"

The agent searches the project for database-related files, reads them, and explains the configuration and connection logic.

## Use with an AFM interpreter Docker image

```bash
docker run -it -v ./code_explainer.afm.md:/app/code_explainer.afm.md \
    -v /path/to/your/project:/project \
    -e ANTHROPIC_API_KEY=<YOUR_API_KEY> \
    -e PROJECT_DIR=/project \
    ghcr.io/wso2/afm-langchain-interpreter:latest run /app/code_explainer.afm.md
```

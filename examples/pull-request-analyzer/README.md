# GitHub PR Analyzer — Sample

An AFM agent that detects drift between code, requirements, and documentation in GitHub pull requests. It is triggered via a webhook and uses the GitHub MCP server for PR operations.

## Structure

```
pull-request-analyzer/
└── pull_request_analyzer.afm.md    # Agent definition
```

## What it demonstrates

- Webhook interface with WebSub subscription for GitHub events
- MCP tool integration with bearer token authentication
- Tool filtering (`tool_filter.allow`) to restrict available MCP tools
- Multi-step workflow with structured instructions

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `GITHUB_TOKEN` | GitHub personal access token |
| `CALLBACK_URL` | Public URL for the webhook callback |
| `GITHUB_WEBHOOK_SECRET` | Secret for verifying GitHub webhook payloads |

## How it works

A [webhook is created for changes related to pull requests (PRs) in a repository](https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks#creating-a-repository-webhook).

Then, when there are changes to PRs, the webhook fires and the agent:

1. **Identifies the kind of change** — checks whether the PR was opened, reopened, or edited, to perform the drift analysis
2. **Discovers documentation** — searches the repository for markdown, README, and requirements files
3. **Retrieves PR data** — gets the diff and baseline documentation from the target branch
4. **Detects drift** — checks in both directions (code → docs and docs → code) for mismatches
5. **Posts a review comment** — summarizes any drift issues with severity levels and action items

## Use with an AFM interpreter Docker image

```bash
docker run -v ./pull_request_analyzer.afm.md:/app/pull_request_analyzer.afm.md \
    -e OPENAI_API_KEY=<YOUR_API_KEY> \
    -e GITHUB_TOKEN=<YOUR_GITHUB_TOKEN> \
    -e CALLBACK_URL=<YOUR_CALLBACK_URL> \
    -e GITHUB_WEBHOOK_SECRET=<YOUR_WEBHOOK_SECRET> \
    -p 8085:8085 \
    ghcr.io/wso2/afm-ballerina-interpreter:latest /app/pull_request_analyzer.afm.md
```

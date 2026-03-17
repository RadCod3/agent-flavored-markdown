# Friendly Assistant — Sample

A simple AFM agent that acts as a conversational assistant, exposed via a web-based chat interface.

## Structure

```
friendly-assistant/
└── friendly_assistant.afm.md    # Agent definition
```

## What it demonstrates

- Minimal agent definition with front matter and instructions
- Web chat interface (`webchat`)
- Basic model configuration with API key from environment variable

## Test scenarios

### 1. General question

**Prompt:** "What's better for a long-haul flight, day time or night time?"

The agent responds with practical, friendly advice.

### 2. Ambiguous request

**Prompt:** "Can you help me with my report?"

The agent asks clarifying questions before providing guidance.

## Use with an AFM interpreter Docker image

```bash
docker run -it -v ./friendly_assistant.afm.md:/app/friendly_assistant.afm.md \
    -e OPENAI_API_KEY=<YOUR_API_KEY> \
    -p 8085:8085 \
    ghcr.io/wso2/afm-ballerina-interpreter:latest /app/friendly_assistant.afm.md
```

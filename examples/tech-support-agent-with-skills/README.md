# Tech Support Agent — Sample

A simple AFM agent that demonstrates [Agent Skills](https://agentskills.io) integration. The agent helps users troubleshoot common platform issues, using a skill for structured diagnosis.

## Structure

```
tech-support-agent-with-skills/
├── support_agent.afm.md          # Agent definition
└── skills/
    └── troubleshooting/
        ├── SKILL.md              # Diagnosis workflow
        └── references/
            ├── authentication.md # Login, MFA, and SSO issues
            └── sync.md           # Data sync issues
```

## How skills are used

The agent follows the [progressive disclosure](https://agentskills.io/specification#progressive-disclosure) model:

1. **Startup** — the agent loads only the skill name and description (~100 tokens).
2. **Activation** — when a user reports an issue, the agent loads the full `SKILL.md` body, which contains a classification table and links to reference files.
3. **Resource loading** — the agent reads the specific reference file for the issue category (e.g., `references/authentication.md` for login problems).

## Test scenarios

### 1. Login issue (skill activates)

**Prompt:** "I can't log in. My password reset email never arrives."

| Step | Action |
|---|---|
| Skill activation | Load **troubleshooting** |
| Classify | Password reset → Authentication |
| Diagnose | Read `references/authentication.md` |
| Respond | Walk through: check spam, verify email, wait 5 min, check for SSO |

### 2. Sync problem (skill activates)

**Prompt:** "My data hasn't updated in hours."

| Step | Action |
|---|---|
| Skill activation | Load **troubleshooting** |
| Classify | Stale data → Sync |
| Diagnose | Read `references/sync.md` |
| Respond | Walk through: check sync status, hard-refresh, trigger manual sync |

### 3. General question (no skill needed)

**Prompt:** "What's the maximum file upload size?"

No skill is activated — the agent answers directly.

## Use with an AFM interpreter Docker image

```bash
docker run -it -v ./support_agent.afm.md:/app/support_agent.afm.md \
    -v ./skills:/app/skills \
    -e ANTHROPIC_API_KEY=<YOUR_API_KEY> \
    -p 8085:8085 \
    ghcr.io/wso2/afm-ballerina-interpreter:latest /app/support_agent.afm.md
```

---
hide:
  - navigation
  - toc
---

<div class="hero-section">
  <div class="hero-content">
    <div class="hero-badge">
      <span class="badge-text">Open Source Specification</span>
    </div>
    <h1 class="hero-title">Agent Flavored Markdown</h1>
    <p class="hero-subtitle">A simple, markdown-based format for defining AI agents. Write agents in plain text that any platform can understand and deploy.</p>
    <div class="hero-buttons">
      <a href="specification" class="hero-button hero-button-primary">Get Started</a>
      <a href="visualizer/" class="hero-button hero-button-secondary">
        <span class="button-icon">▶</span>
        <span>Try the Visualizer</span>
      </a>
    </div>
  </div>
</div>

<div class="section-container secion-demo">
  <!-- <div class="section-header">
    <h2 class="section-title">Create agents from components</h2>
    <p class="section-description">AFM lets you build AI agents out of individual pieces called markdown blocks. Create your own agent definitions combining role, instructions, and tools. Then deploy them across any platform.</p>
  </div> -->

  <div class="code-demo-container">
    <div class="demo-code">
      <div class="demo-code-header">
        <div class="window-controls">
          <span class="control control-close"></span>
          <span class="control control-minimize"></span>
          <span class="control control-maximize"></span>
        </div>
        <span class="demo-file-name">code-review-assistant.md</span>
      </div>
      <div class="demo-code-content">

```markdown
---
spec_version: "0.3.0"
name: "Code Review Assistant"
description: "AI assistant for code review and improvements"
interface:
  type: service
  exposure:
    http:
      path: "/code-review"
tools:
  mcp:
    servers:
      - name: "github"
        transport:
          type: "stdio"
          command: "npx -y @modelcontextprotocol/server-github"
---

# Role

You are a code review assistant focused on security,
correctness, and best practices.

# Instructions

Review code systematically:

1. **Security**: Check for vulnerabilities
2. **Correctness**: Find logic errors and edge cases
3. **Performance**: Identify bottlenecks
4. **Maintainability**: Flag unclear patterns
5. **Testing**: Verify test coverage
```

</div>
    </div>

    <div class="demo-visual">
      <img src="assets/afm-visualization.png" alt="AFM Visualization" class="demo-visualization-image">
    </div>

  </div>
</div>

<div class="section-container section-alt section-why">
  <div class="section-header">
    <h2 class="section-title">Why AFM?</h2>
    <p class="section-description">Agent Flavored Markdown provides a standardized way to define agents that is both human-readable and machine-parseable.</p>
  </div>

  <div class="feature-grid">
    <div class="feature-item">
      <div class="feature-icon-box">
        <svg class="feature-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="feature-title">Simple</h3>
      <p class="feature-description">Write agents in plain markdown. No complex code or proprietary formats required.</p>
    </div>
    <div class="feature-item">
      <div class="feature-icon-box">
        <svg class="feature-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </div>
      <h3 class="feature-title">Shareable</h3>
      <p class="feature-description">AFM agents work across different platforms and tools. Write once, deploy anywhere.</p>
    </div>
    <div class="feature-item">
      <div class="feature-icon-box">
        <svg class="feature-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="feature-title">Collaborative</h3>
      <p class="feature-description">Build multi-agent systems where agents work together to solve complex problems.</p>
    </div>
  </div>
</div>

<div class="cta-section">
  <div class="cta-content">
    <h2 class="section-title">Ready to get started?</h2>
    <p class="section-description">Read the specification to learn how to write your own agents, or try the visualizer to see AFM in action.</p>
    <div class="cta-buttons">
      <a href="specification" class="cta-button-primary">
        <svg class="button-icon-left" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span>Read the Specification</span>
      </a>
    </div>
  </div>
</div>

<!-- <div class="section-container section-alt">
  <div class="section-header">
    <h2 class="section-title">Join a community building the future</h2>
    <p class="section-description">AFM is open source and backed by WSO2. We're building a standard that empowers developers to create portable, interoperable AI agents.</p>
  </div>

  <div class="cta-container">
    <div class="cta-card">
      <h3>Ready to get started?</h3>
      <p>Learn how AFM works and start building your first agent.</p>
      <a href="specification" class="cta-button">Read the Specification</a>
    </div>
    <div class="cta-card">
      <h3>Understand the philosophy</h3>
      <p>Explore why we built AFM and how it compares to other approaches.</p>
      <a href="why-afm/philosophy.md" class="cta-button">Why AFM?</a>
    </div>
  </div>
</div> -->

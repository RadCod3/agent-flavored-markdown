// AFM Visualizer Application
let currentAfmData = null;

// Sample AFM content
const sampleAFM = `---
name: "Code Review Assistant"
description: "An AI assistant that helps review code and suggests improvements"
version: "1.0.0"
namespace: "development-tools"
author: "Sample Author <author@example.com>"
interface:
  exposure:
    http:
      path: "/code-review"
connections:
  mcp:
    servers:
      - name: "github"
        transport:
          type: "stdio"
          command: "npx"
          args: ["-y", "@modelcontextprotocol/server-github"]
      - name: "filesystem"
        transport:
          type: "stdio"
          command: "npx"
          args: ["-y", "@modelcontextprotocol/server-filesystem"]
  a2a:
    peers:
      - name: "documentation_expert"
        endpoint: "https://agents.example.com/docs-expert"
---

# Role

You are a Code Review Assistant specializing in providing constructive feedback on code quality, best practices, and potential improvements.

## Instructions

1. Analyze code for common issues and anti-patterns
2. Suggest improvements with clear explanations
3. Highlight security concerns and performance issues
4. Provide examples of better implementations when appropriate
5. Maintain a helpful and encouraging tone
`;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // File input
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    const dropZone = document.getElementById('drop-zone');
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragleave', handleDragLeave);

    // Sample button
    document.getElementById('load-sample').addEventListener('click', () => {
        loadAfmContent(sampleAFM, 'Sample AFM');
    });

    // Load new file button
    document.getElementById('load-new').addEventListener('click', () => {
        showUploadSection();
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        readFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        readFile(files[0]);
    }
}

function readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        loadAfmContent(content, file.name);
    };
    reader.readAsText(file);
}

function loadAfmContent(content, filename) {
    try {
        currentAfmData = parseAfmFile(content);
        currentAfmData.filename = filename;
        showVisualizerSection();
        renderVisualization();
    } catch (error) {
        alert('Error parsing AFM file: ' + error.message);
        console.error(error);
    }
}

function parseAfmFile(content) {
    // Split frontmatter and markdown body
    const parts = content.split(/^---\s*$/m);
    
    if (parts.length < 3) {
        throw new Error('Invalid AFM format: Missing frontmatter');
    }

    // Parse YAML frontmatter
    const yamlContent = parts[1].trim();
    const metadata = jsyaml.load(yamlContent) || {};
    
    // Get markdown body
    const markdownBody = parts.slice(2).join('---').trim();
    
    return {
        metadata,
        markdownBody,
        rawContent: content
    };
}

function showUploadSection() {
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('visualizer-section').style.display = 'none';
    document.getElementById('file-input').value = '';
}

function showVisualizerSection() {
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('visualizer-section').style.display = 'block';
}

function renderVisualization() {
    if (!currentAfmData) return;

    const { metadata, markdownBody, rawContent } = currentAfmData;

    // Update agent name
    document.getElementById('agent-name').textContent = metadata.name || 'Unnamed Agent';

    // Render hub and spoke
    renderHubSpoke(metadata, markdownBody);

    // Render metadata details
    renderMetadata(metadata);

    // Show raw content
    document.getElementById('raw-content').textContent = rawContent;
}

function parseMarkdownSections(markdown) {
    const sections = { role: '', instructions: '' };
    
    // Split by headers
    const roleMatch = markdown.match(/#+\s*Role\s*\n([\s\S]*?)(?=\n#+\s*|$)/i);
    const instructionsMatch = markdown.match(/#+\s*Instructions?\s*\n([\s\S]*?)(?=\n#+\s*|$)/i);
    
    if (roleMatch) {
        sections.role = roleMatch[1].trim();
    }
    
    if (instructionsMatch) {
        sections.instructions = instructionsMatch[1].trim();
    }
    
    return sections;
}

function renderHubSpoke(metadata, markdownBody) {
    const container = document.getElementById('hub-spoke-container');
    
    // Count connections and interface
    const mcpServers = metadata.connections?.mcp?.servers || [];
    const a2aPeers = metadata.connections?.a2a?.peers || [];
    const hasInterface = metadata.interface?.exposure;
    const interfaceTypes = hasInterface ? Object.keys(metadata.interface.exposure) : [];

    const html = `
        <div class="hub-spoke-visual">
            <!-- SVG for connection lines -->
            <svg class="connections-svg" viewBox="0 0 1200 900">
                ${hasInterface ? '<line x1="600" y1="450" x2="1010" y2="180" stroke="#6f42c1" stroke-width="3" />' : ''}
                ${mcpServers.map((_, idx) => 
                    `<line x1="600" y1="450" x2="190" y2="${300 + (idx * 160)}" stroke="#cbd5e0" stroke-width="2.5" />`
                ).join('')}
                ${a2aPeers.map((_, idx) => 
                    `<line x1="600" y1="450" x2="1010" y2="${(hasInterface ? 380 : 300) + (idx * 160)}" stroke="#cbd5e0" stroke-width="2.5" />`
                ).join('')}
            </svg>

            <!-- Central Hub (includes core agent identity and instructions) -->
            <div class="hub" data-spoke-type="hub">
                <div class="hub-icon">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="hub-title">${metadata.name || 'Unnamed Agent'}</div>
                <div class="hub-subtitle">${(metadata.description || 'No description').substring(0, 85)}${(metadata.description || '').length > 85 ? '...' : ''}</div>
                ${metadata.version ? `<div class="hub-version">v${metadata.version}</div>` : ''}
                ${markdownBody ? (() => {
                    const sections = parseMarkdownSections(markdownBody);
                    return `
                    <div class="hub-instructions">
                        ${sections.role ? `
                        <div class="hub-section">
                            <div class="hub-section-label">
                                <i class="bi bi-person-badge me-1"></i>
                                Role
                            </div>
                            <div class="hub-section-content">${sections.role.substring(0, 110)}${sections.role.length > 110 ? '...' : ''}</div>
                        </div>
                        ` : ''}
                        ${sections.instructions ? `
                        <div class="hub-section">
                            <div class="hub-section-label">
                                <i class="bi bi-list-check me-1"></i>
                                Instructions
                            </div>
                            <div class="hub-section-content">${sections.instructions.substring(0, 110)}${sections.instructions.length > 110 ? '...' : ''}</div>
                        </div>
                        ` : ''}
                    </div>
                    `;
                })() : ''}
            </div>

            <!-- Spokes -->
            <div class="spokes-container">

                <!-- Interface Spoke -->
                ${hasInterface ? `
                <div class="spoke-group-label" style="position: absolute; top: 30px; right: 30px;">Interface</div>
                <div class="spoke spoke-interface" data-spoke-type="interface" style="position: absolute; top: 80px; right: 30px;">
                    <div class="spoke-icon">
                        <i class="bi bi-broadcast"></i>
                    </div>
                    <div class="spoke-title">Interface</div>
                    <div class="spoke-subtitle">${interfaceTypes.join(', ')}</div>
                </div>
                ` : ''}

                <!-- MCP Connections -->
                ${mcpServers.length > 0 ? `
                <div class="spoke-group-label" style="position: absolute; top: 140px; left: 30px;">MCP Connections</div>
                ${mcpServers.map((server, idx) => `
                    <div class="spoke spoke-mcp" data-spoke-type="mcp" data-spoke-index="${idx}" style="position: absolute; top: ${190 + (idx * 160)}px; left: 30px;">
                        <div class="spoke-icon">
                            ${server.name.includes('github') ? '🔗' : 
                              server.name.includes('filesystem') ? '📁' : '🔧'}
                        </div>
                        <div class="spoke-title">${server.name}</div>
                        <div class="spoke-subtitle">${server.transport?.type || 'stdio'}</div>
                    </div>
                `).join('')}
                ` : ''}

                <!-- A2A Peers -->
                ${a2aPeers.length > 0 ? `
                <div class="spoke-group-label" style="position: absolute; top: ${hasInterface ? '230' : '140'}px; right: 30px;">Peer Agents</div>
                ${a2aPeers.map((peer, idx) => `
                    <div class="spoke spoke-a2a" data-spoke-type="a2a" data-spoke-index="${idx}" style="position: absolute; top: ${(hasInterface ? 280 : 190) + (idx * 160)}px; right: 30px;">
                        <div class="spoke-icon">👥</div>
                        <div class="spoke-title">${peer.name}</div>
                        <div class="spoke-subtitle">A2A Connection</div>
                    </div>
                `).join('')}
                ` : ''}
            </div>
        </div>
    `;

    container.innerHTML = html;
    
    // Add click handlers to spokes
    setTimeout(() => {
        document.querySelectorAll('.hub, .spoke').forEach(element => {
            element.addEventListener('click', handleSpokeClick);
        });
    }, 0);
}

function handleSpokeClick(e) {
    const element = e.currentTarget;
    const spokeType = element.getAttribute('data-spoke-type');
    const spokeIndex = element.getAttribute('data-spoke-index');
    
    showSpokeDetails(spokeType, spokeIndex);
}

function showSpokeDetails(spokeType, spokeIndex) {
    const detailsTitle = document.getElementById('spoke-details-title');
    const detailsContent = document.getElementById('spoke-details-content');
    
    const { metadata, markdownBody } = currentAfmData;
    
    let html = '';
    let title = '';
    
    switch(spokeType) {
        case 'hub':
            title = '<i class="bi bi-robot me-2"></i>Agent Core';
            html = `
                <div class="detail-form">
                    <h6 class="text-muted mb-3">Metadata</h6>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Agent Name</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${metadata.name || ''}" readonly>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Description</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" rows="2" readonly>${metadata.description || ''}</textarea>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Version</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${metadata.version || ''}" readonly>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Namespace</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${metadata.namespace || ''}" readonly>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Author</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${metadata.author || ''}" readonly>
                        </div>
                    </div>
                    ${metadata.license ? `
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">License</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${metadata.license}" readonly>
                        </div>
                    </div>
                    ` : ''}
                    
                    <hr class="my-4">
                    
                    <h6 class="text-muted mb-3">Role & Instructions</h6>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Markdown Content</label>
                        <textarea class="form-control" rows="12" readonly>${markdownBody}</textarea>
                    </div>
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        The hub represents the agent's core identity, including its metadata and behavior instructions.
                    </div>
                </div>
            `;
            break;
            
        case 'mcp':
            const mcpServer = metadata.connections?.mcp?.servers?.[spokeIndex];
            if (mcpServer) {
                title = `<i class="bi bi-diagram-3 me-2"></i>MCP Server: ${mcpServer.name}`;
                html = `
                    <div class="detail-form">
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Server Name</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${mcpServer.name}" readonly>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Transport Type</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${mcpServer.transport?.type || 'stdio'}" readonly>
                            </div>
                        </div>
                        ${mcpServer.transport?.command ? `
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Command</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${mcpServer.transport.command}" readonly>
                            </div>
                        </div>
                        ` : ''}
                        ${mcpServer.transport?.args ? `
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Arguments</label>
                            <div class="col-sm-9">
                                <textarea class="form-control" rows="3" readonly>${mcpServer.transport.args.join('\n')}</textarea>
                            </div>
                        </div>
                        ` : ''}
                        ${mcpServer.transport?.url ? `
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">URL</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${mcpServer.transport.url}" readonly>
                            </div>
                        </div>
                        ` : ''}
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            This MCP server provides tools and resources that the agent can use.
                        </div>
                    </div>
                `;
            }
            break;
            
        case 'interface':
            title = '<i class="bi bi-broadcast me-2"></i>Agent Interface';
            const interfaceExposure = metadata.interface?.exposure || {};
            html = `
                <div class="detail-form">
                    <h6 class="text-muted mb-3">Exposure Types</h6>
                    ${Object.keys(interfaceExposure).map(type => {
                        const config = interfaceExposure[type];
                        if (type === 'http') {
                            return `
                                <div class="mb-4">
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Type</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" value="HTTP" readonly>
                                        </div>
                                    </div>
                                    ${config.path ? `
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Path</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" value="${config.path}" readonly>
                                        </div>
                                    </div>
                                    ` : ''}
                                    ${config.port ? `
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Port</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" value="${config.port}" readonly>
                                        </div>
                                    </div>
                                    ` : ''}
                                </div>
                            `;
                        } else if (type === 'a2a') {
                            return `
                                <div class="mb-4">
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Type</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" value="A2A" readonly>
                                        </div>
                                    </div>
                                    ${config.endpoint ? `
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Endpoint</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" value="${config.endpoint}" readonly>
                                        </div>
                                    </div>
                                    ` : ''}
                                </div>
                            `;
                        } else {
                            return `
                                <div class="mb-4">
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Type</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" value="${type.toUpperCase()}" readonly>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Configuration</label>
                                        <div class="col-sm-9">
                                            <textarea class="form-control" rows="4" readonly>${JSON.stringify(config, null, 2)}</textarea>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    }).join('')}
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        The interface defines how this agent is exposed and can be accessed by external systems.
                    </div>
                </div>
            `;
            break;
            
        case 'a2a':
            const a2aPeer = metadata.connections?.a2a?.peers?.[spokeIndex];
            if (a2aPeer) {
                title = `<i class="bi bi-people me-2"></i>Peer Agent: ${a2aPeer.name}`;
                html = `
                    <div class="detail-form">
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Peer Name</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${a2aPeer.name}" readonly>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Endpoint</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${a2aPeer.endpoint}" readonly>
                            </div>
                        </div>
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            This agent can collaborate with this peer agent through the A2A protocol.
                        </div>
                    </div>
                `;
            }
            break;
    }
    
    detailsTitle.innerHTML = title;
    detailsContent.innerHTML = html;
}

function renderMetadata(metadata) {
    const container = document.getElementById('metadata-details');
    
    const fields = [
        { label: 'Name', value: metadata.name },
        { label: 'Description', value: metadata.description },
        { label: 'Version', value: metadata.version },
        { label: 'Namespace', value: metadata.namespace },
        { label: 'Author', value: metadata.author },
        { label: 'License', value: metadata.license },
    ];

    const connections = [];
    if (metadata.connections?.mcp?.servers) {
        connections.push(`MCP Servers: ${metadata.connections.mcp.servers.length}`);
    }
    if (metadata.connections?.a2a?.peers) {
        connections.push(`A2A Peers: ${metadata.connections.a2a.peers.length}`);
    }

    const html = `
        <table class="table table-sm">
            <tbody>
                ${fields.filter(f => f.value).map(f => `
                    <tr>
                        <th style="width: 30%;">${f.label}</th>
                        <td>${f.value}</td>
                    </tr>
                `).join('')}
                ${connections.length > 0 ? `
                    <tr>
                        <th>Connections</th>
                        <td>${connections.join('<br>')}</td>
                    </tr>
                ` : ''}
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

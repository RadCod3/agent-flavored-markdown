let currentAfmData = null;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) {
        return '';
    }
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
const sampleAFM = `---
name: "Code Review Assistant"
description: "An AI assistant that helps review code and suggests improvements"
version: "1.0.0"
namespace: "development-tools"
author: "Sample Author <author@example.com>"
interface:
  type: service
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

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    
    fileInput.addEventListener('change', handleFileSelect);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragleave', handleDragLeave);
    
    document.getElementById('load-sample').addEventListener('click', () => {
        loadAfmContent(sampleAFM, 'Sample AFM');
    });
    
    document.getElementById('load-new').addEventListener('click', showUploadSection);
});

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
    if (file.size > MAX_FILE_SIZE) {
        alert(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => loadAfmContent(e.target.result, file.name);
    reader.onerror = () => alert('Error reading file. Please try again.');
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
    if (content.length > MAX_FILE_SIZE) {
        throw new Error('File content is too large');
    }
    
    const parts = content.split(/^---\s*$/m);
    if (parts.length < 3) {
        throw new Error('Invalid AFM format: Missing frontmatter');
    }

    try {
        const metadata = jsyaml.load(parts[1].trim(), {
            schema: jsyaml.JSON_SCHEMA,
            json: true
        }) || {};
        
        return {
            metadata,
            markdownBody: parts.slice(2).join('---').trim(),
            rawContent: content
        };
    } catch (error) {
        throw new Error('Failed to parse YAML: ' + error.message);
    }
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

    document.getElementById('agent-name').textContent = metadata.name || 'Unnamed Agent';
    document.getElementById('raw-content').textContent = rawContent;
    
    renderHubSpoke(metadata, markdownBody);
    renderMetadata(metadata);
}

function parseMarkdownSections(markdown) {
    const roleMatch = markdown.match(/#+\s*Role\s*\n([\s\S]*?)(?=\n#+\s*|$)/i);
    const instructionsMatch = markdown.match(/#+\s*Instructions?\s*\n([\s\S]*?)(?=\n#+\s*|$)/i);
    
    return {
        role: roleMatch ? roleMatch[1].trim() : '',
        instructions: instructionsMatch ? instructionsMatch[1].trim() : ''
    };
}

function renderHubSpoke(metadata, markdownBody) {
    const container = document.getElementById('hub-spoke-container');
    
    const mcpServers = metadata.connections?.mcp?.servers || [];
    const a2aPeers = metadata.connections?.a2a?.peers || [];
    const hasInterface = metadata.interface?.exposure;
    const interfaceTypes = hasInterface ? Object.keys(metadata.interface.exposure).map(escapeHtml) : [];
    const interfaceType = metadata.interface?.type || 'function';

    const escapedName = escapeHtml(metadata.name || 'Unnamed Agent');
    const escapedDescription = escapeHtml(metadata.description || 'No description');
    const escapedVersion = escapeHtml(metadata.version);
    const escapedInterfaceType = escapeHtml(interfaceType);
    
    const sections = markdownBody ? parseMarkdownSections(markdownBody) : { role: '', instructions: '' };
    const escapedRole = escapeHtml(sections.role);
    const escapedInstructions = escapeHtml(sections.instructions);

    const html = `
        <div class="hub-spoke-visual">
            <svg class="connections-svg" viewBox="0 0 1200 900">
                ${hasInterface ? '<line x1="600" y1="450" x2="1010" y2="180" stroke="#ff7300" stroke-width="2.5" />' : ''}
                ${mcpServers.map((_, idx) => 
                    `<line x1="600" y1="450" x2="190" y2="${300 + (idx * 160)}" stroke="#cbd5e0" stroke-width="2.5" />`
                ).join('')}
                ${a2aPeers.map((_, idx) => 
                    `<line x1="600" y1="450" x2="1010" y2="${(hasInterface ? 380 : 300) + (idx * 160)}" stroke="#cbd5e0" stroke-width="2.5" />`
                ).join('')}
            </svg>

            <div class="hub" data-spoke-type="hub">
                <div class="hub-icon">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="hub-title">${escapedName}</div>
                <div class="hub-subtitle">${escapedDescription.substring(0, 85)}${escapedDescription.length > 85 ? '...' : ''}</div>
                <div class="hub-badges">
                    ${metadata.version ? `<span class="hub-version">v${escapedVersion}</span>` : ''}
                    <span class="hub-type hub-type-${escapedInterfaceType}">${escapedInterfaceType}</span>
                </div>
                ${markdownBody ? `
                    <div class="hub-instructions">
                        ${sections.role ? `
                        <div class="hub-section">
                            <div class="hub-section-label">
                                <i class="bi bi-person-badge me-1"></i>
                                Role
                            </div>
                            <div class="hub-section-content">${escapedRole.substring(0, 110)}${escapedRole.length > 110 ? '...' : ''}</div>
                        </div>
                        ` : ''}
                        ${sections.instructions ? `
                        <div class="hub-section">
                            <div class="hub-section-label">
                                <i class="bi bi-list-check me-1"></i>
                                Instructions
                            </div>
                            <div class="hub-section-content">${escapedInstructions.substring(0, 110)}${escapedInstructions.length > 110 ? '...' : ''}</div>
                        </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>

            <div class="spokes-container">
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
                ${mcpServers.length > 0 ? `
                <div class="spoke-group-label" style="position: absolute; top: 140px; left: 30px;">MCP Connections</div>
                ${mcpServers.map((server, idx) => {
                    const escapedServerName = escapeHtml(server.name);
                    const escapedTransportType = escapeHtml(server.transport?.type || 'stdio');
                    return `
                    <div class="spoke spoke-mcp" data-spoke-type="mcp" data-spoke-index="${idx}" style="position: absolute; top: ${190 + (idx * 160)}px; left: 30px;">
                        <div class="spoke-icon">
                            ${server.name && server.name.includes('github') ? '🔗' : 
                              server.name && server.name.includes('filesystem') ? '📁' : '🔧'}
                        </div>
                        <div class="spoke-title">${escapedServerName}</div>
                        <div class="spoke-subtitle">${escapedTransportType}</div>
                    </div>
                `}).join('')}
                ` : ''}
                ${a2aPeers.length > 0 ? `
                <div class="spoke-group-label" style="position: absolute; top: ${hasInterface ? '230' : '140'}px; right: 30px;">Peer Agents</div>
                ${a2aPeers.map((peer, idx) => {
                    const escapedPeerName = escapeHtml(peer.name);
                    return `
                    <div class="spoke spoke-a2a" data-spoke-type="a2a" data-spoke-index="${idx}" style="position: absolute; top: ${(hasInterface ? 280 : 190) + (idx * 160)}px; right: 30px;">
                        <div class="spoke-icon">👥</div>
                        <div class="spoke-title">${escapedPeerName}</div>
                        <div class="spoke-subtitle">A2A Connection</div>
                    </div>
                `}).join('')}
                ` : ''}
            </div>
        </div>
    `;

    container.innerHTML = html;
    
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
                            <input type="text" class="form-control" value="${escapeHtml(metadata.name || '')}" readonly>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Description</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" rows="2" readonly>${escapeHtml(metadata.description || '')}</textarea>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Version</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${escapeHtml(metadata.version || '')}" readonly>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Namespace</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${escapeHtml(metadata.namespace || '')}" readonly>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Author</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${escapeHtml(metadata.author || '')}" readonly>
                        </div>
                    </div>
                    ${metadata.license ? `
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">License</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${escapeHtml(metadata.license)}" readonly>
                        </div>
                    </div>
                    ` : ''}
                    
                    <hr class="my-4">
                    
                    <h6 class="text-muted mb-3">Role & Instructions</h6>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Markdown Content</label>
                        <textarea class="form-control" rows="12" readonly>${escapeHtml(markdownBody)}</textarea>
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
                title = `<i class="bi bi-diagram-3 me-2"></i>MCP Server: ${escapeHtml(mcpServer.name)}`;
                html = `
                    <div class="detail-form">
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Server Name</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${escapeHtml(mcpServer.name)}" readonly>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Transport Type</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${escapeHtml(mcpServer.transport?.type || 'stdio')}" readonly>
                            </div>
                        </div>
                        ${mcpServer.transport?.command ? `
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Command</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${escapeHtml(mcpServer.transport.command)}" readonly>
                            </div>
                        </div>
                        ` : ''}
                        ${mcpServer.transport?.args && mcpServer.transport.args.length > 0 ? `
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Arguments</label>
                            <div class="col-sm-9">
                                <div class="args-list">
                                    ${mcpServer.transport.args.map((arg, idx) => `
                                        <div class="arg-item">
                                            <span class="arg-index">${idx}</span>
                                            <code class="arg-value">${escapeHtml(arg)}</code>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                        ${mcpServer.transport?.url ? `
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">URL</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${escapeHtml(mcpServer.transport.url)}" readonly>
                            </div>
                        </div>
                        ` : ''}
                        ${mcpServer.authentication ? `
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Authentication</label>
                            <div class="col-sm-9">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-shield-lock"></i></span>
                                    <input type="text" class="form-control" value="${escapeHtml(mcpServer.authentication.type || 'configured')}" readonly>
                                </div>
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
            const interfaceSignature = metadata.interface?.signature;
            const interfaceTypeValue = metadata.interface?.type || 'function';
            html = `
                <div class="detail-form">
                    <h6 class="text-muted mb-3">Interface Configuration</h6>
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label fw-bold">Type</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="${escapeHtml(interfaceTypeValue)}" readonly>
                        </div>
                    </div>
                    
                    ${interfaceSignature ? `
                        <hr class="my-4">
                        <h6 class="text-muted mb-3">Signature</h6>
                        
                        ${interfaceSignature.input && interfaceSignature.input.length > 0 ? `
                            <div class="mb-4">
                                <label class="form-label fw-bold">Input Parameters</label>
                                <div class="table-responsive">
                                    <table class="table table-sm table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Required</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${interfaceSignature.input.map(param => `
                                                <tr>
                                                    <td><code>${escapeHtml(param.name)}</code></td>
                                                    <td><span class="badge bg-secondary">${escapeHtml(param.type || 'string')}</span></td>
                                                    <td>${param.required ? '<span class="badge bg-danger">Required</span>' : '<span class="badge bg-secondary">Optional</span>'}</td>
                                                    <td>${escapeHtml(param.description || '-')}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${interfaceSignature.output && interfaceSignature.output.length > 0 ? `
                            <div class="mb-4">
                                <label class="form-label fw-bold">Output Parameters</label>
                                <div class="table-responsive">
                                    <table class="table table-sm table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${interfaceSignature.output.map(param => `
                                                <tr>
                                                    <td><code>${escapeHtml(param.name)}</code></td>
                                                    <td><span class="badge bg-secondary">${escapeHtml(param.type || 'string')}</span></td>
                                                    <td>${escapeHtml(param.description || '-')}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ` : ''}
                    ` : ''}
                    
                    ${Object.keys(interfaceExposure).length > 0 ? `
                        <hr class="my-4">
                        <h6 class="text-muted mb-3">Exposure Types</h6>
                    ` : ''}
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
                                            <input type="text" class="form-control" value="${escapeHtml(config.path)}" readonly>
                                        </div>
                                    </div>
                                    ` : ''}
                                    ${config.port ? `
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Port</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" value="${escapeHtml(String(config.port))}" readonly>
                                        </div>
                                    </div>
                                    ` : ''}
                                    ${config.authentication ? `
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Authentication</label>
                                        <div class="col-sm-9">
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="bi bi-shield-lock"></i></span>
                                                <input type="text" class="form-control" value="${escapeHtml(config.authentication.type || 'configured')}" readonly>
                                            </div>
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
                                            <input type="text" class="form-control" value="${escapeHtml(config.endpoint)}" readonly>
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
                                            <input type="text" class="form-control" value="${escapeHtml(type.toUpperCase())}" readonly>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <label class="col-sm-3 col-form-label fw-bold">Configuration</label>
                                        <div class="col-sm-9">
                                            <textarea class="form-control" rows="4" readonly>${escapeHtml(JSON.stringify(config, null, 2))}</textarea>
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
                title = `<i class="bi bi-people me-2"></i>Peer Agent: ${escapeHtml(a2aPeer.name)}`;
                html = `
                    <div class="detail-form">
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Peer Name</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${escapeHtml(a2aPeer.name)}" readonly>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-3 col-form-label fw-bold">Endpoint</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" value="${escapeHtml(a2aPeer.endpoint)}" readonly>
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
                        <th style="width: 30%;">${escapeHtml(f.label)}</th>
                        <td>${escapeHtml(f.value)}</td>
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

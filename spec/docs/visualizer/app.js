
function renderMcpDetailsHtml(mcpServer) {
    return `
        <div class="detail-form">
            <div class="mb-4">
                <div class="fw-bold mb-1">Server Name</div>
                <input type="text" class="form-control" value="${escapeHtml(mcpServer.name)}" readonly>
            </div>

            <div class="mb-4 border rounded p-3">
                <h6 class="fw-bold mb-2">Transport</h6>
                <div class="mb-3">
                    <div class="fw-semibold">Type:</div>
                    <div class="border rounded p-2 bg-white mt-1">${escapeHtml(mcpServer.transport?.type || 'stdio')}</div>
                </div>
                ${mcpServer.transport?.command ? `
                <div class="mb-3">
                    <div class="fw-semibold">Command:</div>
                    <div class="border rounded p-2 bg-white mt-1">${highlightVars(mcpServer.transport.command)}</div>
                </div>
                ` : ''}
                ${mcpServer.transport?.url ? `
                <div class="mb-3">
                    <div class="fw-semibold">URL:</div>
                    <div class="border rounded p-2 bg-white mt-1">${highlightVars(mcpServer.transport.url)}</div>
                </div>
                ` : ''}
            </div>

            ${mcpServer.transport?.args && mcpServer.transport.args.length > 0 ? `
            <div class="mb-4 border rounded p-3">
                <h6 class="fw-bold mb-2">Arguments</h6>
                <div id="transport-args">
                    ${mcpServer.transport.args.map((arg, idx) => `
                        <div class="mb-3">
                            <div class="fw-semibold">${idx}</div>
                            <div class="border rounded p-2 bg-white mt-1"><code class="arg-value">${highlightVars(arg)}</code></div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            ${mcpServer.authentication ? `
            <div class="mb-4 border rounded p-3">
                <h6 class="fw-bold mb-2">Authentication</h6>
                <div class="mb-3">
                    <div class="fw-semibold">Type:</div>
                    <div class="border rounded p-2 bg-white mt-1">${highlightVars(mcpServer.authentication.type || 'configured')}</div>
                </div>
                ${mcpServer.authentication.token ? `
                <div class="mb-3">
                    <div class="fw-semibold">Token:</div>
                    <div class="border rounded p-2 bg-white mt-1">${highlightVars(mcpServer.authentication.token)}</div>
                </div>
                ` : ''}
            </div>
            ` : ''}

            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                This MCP server provides tools and resources that the agent can use.
            </div>
        </div>
    `;
}
let currentAfmData = null;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const UI_CONSTANTS = {
    ROLE_HEIGHT: 280,
    INSTRUCTIONS_HEIGHT: 320,
    HUB_SPOKE_MIN_HEIGHT: 850,
    // Spoke positioning
    SPOKE_START_TOP: 190,
    SPOKE_SPACING: 160,
    SPOKE_GROUP_LABEL_TOP: 140,
    INTERFACE_SPOKE_TOP: 80,
    INTERFACE_LABEL_TOP: 30,
    // Text truncation
    DESCRIPTION_MAX_LENGTH: 85,
    HUB_CONTENT_MAX_LENGTH: 110
};

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
spec_version: \"0.3.0\"
name: \"Code Review Assistant\"
description: \"An AI assistant that helps review code and suggests improvements\"
version: \"1.0.0\"
namespace: \"development-tools\"
author: \"Sample Author <author@example.com>\"
interface:
  type: service
  exposure:
    http:
      path: \"/code-review\"
tools:
  mcp:
    servers:
      - name: \"github\"
        transport:
          type: \"stdio\"
          command: \"npx -y @modelcontextprotocol/server-github\"
      - name: \"filesystem\"
        transport:
          type: \"stdio\"
          command: \"npx -y @modelcontextprotocol/server-filesystem\"
      - name: \"code-analysis-api\"
        transport:
          type: \"streamable-http\"
          url: \"\${BASE_URL}/mcp/v1\"
        authentication:
          type: \"bearer\"
          token: \"\${env:API_TOKEN}\"
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

function initializeMarked() {
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: false,       // Don't convert single \n to <br> (use proper markdown line breaks)
            gfm: true,           // GitHub Flavored Markdown
            headerIds: false,    // Don't add IDs to headers
            mangle: false,       // Don't escape autolinked email addresses
            pedantic: false,     // Be lenient with markdown parsing
            smartLists: true     // Use smarter list behavior
        });
    }
}

function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const savedTheme = localStorage.getItem('afm-theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark.matches);
    
    if (isDark) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
    
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('afm-theme', isDarkMode ? 'dark' : 'light');
        updateThemeIcon(isDarkMode);
    });
    
    prefersDark.addEventListener('change', (e) => {
        const themePref = localStorage.getItem('afm-theme');
        if (!themePref) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                updateThemeIcon(true);
            } else {
                document.body.classList.remove('dark-mode');
                updateThemeIcon(false);
            }
        }
    });
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#theme-toggle i');
    if (isDark) {
        icon.className = 'bi bi-sun-fill';
    } else {
        icon.className = 'bi bi-moon-stars';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeMarked();
    initializeDarkMode();
    
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

function showErrorModal(title, message) {
    // Create a Bootstrap-style modal
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-exclamation-triangle me-2"></i>${title}
                        </h5>
                        <button type="button" class="btn-close btn-close-white"></button>
                    </div>
                    <div class="modal-body">
                        ${message}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close-btn">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const closeButtons = modal.querySelectorAll('.btn-close, .modal-close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => modal.remove());
    });
    
    // Auto-remove on backdrop click
    modal.querySelector('.modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            modal.remove();
        }
    });
}

function readFile(file) {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        showErrorModal(
            'File Too Large',
            `<p>The selected file is too large to process.</p>
             <p><strong>Maximum allowed size:</strong> ${MAX_FILE_SIZE / 1024 / 1024}MB</p>
             <p><strong>Your file size:</strong> ${(file.size / 1024 / 1024).toFixed(2)}MB</p>
             <p class="mb-0">Please select a smaller file and try again.</p>`
        );
        return;
    }
    
    // Validate file extension
    const validExtensions = ['.md', '.afm.md', '.afm'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
        showErrorModal(
            'Invalid File Type',
            `<p>The file you selected is not a valid AFM file.</p>
             <p><strong>Accepted file types:</strong></p>
             <ul>
                <li><code>.md</code> - Markdown files</li>
                <li><code>.afm.md</code> - AFM markdown files</li>
                <li><code>.afm</code> - AFM files</li>
             </ul>
             <p><strong>Your file:</strong> <code>${escapeHtml(file.name)}</code></p>
             <p class="mb-0">Please select a valid AFM file and try again.</p>`
        );
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            loadAfmContent(e.target.result, file.name);
        } catch (error) {
            showErrorModal(
                'Error Processing File',
                `<p>An error occurred while processing your AFM file:</p>
                 <div class="alert alert-danger mb-3">
                    <code>${escapeHtml(error.message)}</code>
                 </div>
                 <p><strong>Common issues:</strong></p>
                 <ul>
                    <li>Invalid YAML frontmatter syntax</li>
                    <li>Missing frontmatter delimiters (<code>---</code>)</li>
                    <li>Incorrectly formatted metadata</li>
                 </ul>
                 <p class="mb-0">Please check your file format and try again.</p>`
            );
            console.error('File processing error:', error);
        }
    };
    
    reader.onerror = (e) => {
        showErrorModal(
            'Error Reading File',
            `<p>Failed to read the selected file.</p>
             <p><strong>Possible causes:</strong></p>
             <ul>
                <li>File is corrupted</li>
                <li>Insufficient permissions</li>
                <li>File is locked by another program</li>
             </ul>
             <p class="mb-0">Please check the file and try again.</p>`
        );
        console.error('FileReader error:', e);
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
        showErrorModal(
            'Error Parsing AFM File',
            `<p>Failed to parse the AFM file:</p>
             <div class="alert alert-danger mb-3">
                <code>${escapeHtml(error.message)}</code>
             </div>
             <p><strong>Expected AFM format:</strong></p>
             <pre class="bg-light p-3 rounded"><code>---
name: "Agent Name"
description: "Description"
version: "1.0.0"
---

# Role

Your agent's role description

## Instructions

1. First instruction
2. Second instruction</code></pre>
             <p class="mb-0">Please ensure your file follows the AFM specification.</p>`
        );
        console.error(error);
    }
}

function parseAfmFile(content) {
    if (content.length > MAX_FILE_SIZE) {
        throw new Error('File content is too large');
    }
    
    const parts = content.split(/^---\s*$/m);
    if (parts.length < 3) {
        throw new Error('Invalid AFM format: Missing frontmatter delimiters (---). Expected format:\n---\n[YAML metadata]\n---\n[Markdown content]');
    }

    let metadata;
    try {
        metadata = jsyaml.load(parts[1].trim(), {
            schema: jsyaml.JSON_SCHEMA,
            json: true
        });
        
        if (metadata === null || metadata === undefined) {
            metadata = {};
        }
        
        // Validate metadata is an object
        if (typeof metadata !== 'object' || Array.isArray(metadata)) {
            throw new Error('YAML frontmatter must be an object');
        }
        
    } catch (error) {
        if (error.name === 'YAMLException') {
            throw new Error('Invalid YAML syntax in frontmatter: ' + error.message);
        }
        throw new Error('Failed to parse YAML frontmatter: ' + error.message);
    }
    
    const markdownBody = parts.slice(2).join('---').trim();
    
    // Validate markdown body exists
    if (!markdownBody) {
        console.warn('AFM file has no markdown content');
    }
    
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

    document.getElementById('agent-name').textContent = metadata.name || 'Unnamed Agent';
    document.getElementById('raw-content').textContent = rawContent;
    
    renderHubSpoke(metadata, markdownBody);
    renderMetadata(metadata);
    
    // Open Agent Core by default
    showSpokeDetails('hub', null);
}

function parseMarkdownSections(markdown) {
    const roleMatch = markdown.match(/#+\s*Role\s*\n([\s\S]*?)(?=\n#+\s*|$)/i);
    const instructionsMatch = markdown.match(/#+\s*Instructions?\s*\n([\s\S]*?)(?=\n#+\s*|$)/i);
    
    return {
        role: roleMatch ? roleMatch[1].trim() : '',
        instructions: instructionsMatch ? instructionsMatch[1].trim() : ''
    };
}

function convertMarkdownToHtml(text) {
    // Use marked library for proper markdown parsing
    if (typeof marked !== 'undefined' && marked.parse) {
        try {
            const rawHtml = marked.parse(text);
            if (typeof DOMPurify !== 'undefined') {
                return DOMPurify.sanitize(rawHtml);
            }
            // If DOMPurify is not available, strip script tags as a minimal safeguard
            return rawHtml.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
        } catch (error) {
            console.error('Marked parsing error:', error);
            // Fall through to fallback
        }
    }
    // Fallback: basic HTML with line breaks preserved
    console.warn('Marked library not available, using fallback');
    return '<p>' + escapeHtml(text).replace(/\n/g, '<br>') + '</p>';
}

function renderHubSpoke(metadata, markdownBody) {
    const container = document.getElementById('hub-spoke-container');
    
    const mcpServers = metadata.tools?.mcp?.servers || [];
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
                ${hasInterface ? '<line x1="600" y1="450" x2="1010" y2="180" class="connection-line-interface" stroke-width="2.5" />' : ''}
                ${mcpServers.map((_, idx) => 
                    `<line x1="600" y1="450" x2="190" y2="${300 + (idx * 160)}" class="connection-line-mcp" stroke-width="2.5" />`
                ).join('')}
            </svg>

            <div class="hub" data-spoke-type="hub">
                <div class="hub-icon">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="hub-title">${escapedName}</div>
                <div class="hub-subtitle">${escapedDescription.substring(0, UI_CONSTANTS.DESCRIPTION_MAX_LENGTH)}${escapedDescription.length > UI_CONSTANTS.DESCRIPTION_MAX_LENGTH ? '...' : ''}</div>
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
                            <div class="hub-section-content">${escapedRole.substring(0, UI_CONSTANTS.HUB_CONTENT_MAX_LENGTH)}${escapedRole.length > UI_CONSTANTS.HUB_CONTENT_MAX_LENGTH ? '...' : ''}</div>
                        </div>
                        ` : ''}
                        ${sections.instructions ? `
                        <div class="hub-section">
                            <div class="hub-section-label">
                                <i class="bi bi-list-check me-1"></i>
                                Instructions
                            </div>
                            <div class="hub-section-content">${escapedInstructions.substring(0, UI_CONSTANTS.HUB_CONTENT_MAX_LENGTH)}${escapedInstructions.length > UI_CONSTANTS.HUB_CONTENT_MAX_LENGTH ? '...' : ''}</div>
                        </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>

            <div class="spokes-container">
                ${hasInterface ? `
                <div class="spoke-group-label" style="position: absolute; top: ${UI_CONSTANTS.INTERFACE_LABEL_TOP}px; right: 30px;">Interface</div>
                <div class="spoke spoke-interface" data-spoke-type="interface" style="position: absolute; top: ${UI_CONSTANTS.INTERFACE_SPOKE_TOP}px; right: 30px;">
                    <div class="spoke-icon">
                        <i class="bi bi-broadcast"></i>
                    </div>
                    <div class="spoke-title">Interface</div>
                    <div class="spoke-subtitle">${interfaceTypes.join(', ')}</div>
                </div>
                ` : ''}
                ${mcpServers.length > 0 ? `
                <div class="spoke-group-label" style="position: absolute; top: ${UI_CONSTANTS.SPOKE_GROUP_LABEL_TOP}px; left: 30px;">MCP Tools</div>
                ${mcpServers.map((server, idx) => {
                    const escapedServerName = escapeHtml(server.name);
                    const escapedTransportType = escapeHtml(server.transport?.type || 'stdio');
                    return `
                    <div class="spoke spoke-mcp" data-spoke-type="mcp" data-spoke-index="${idx}" style="position: absolute; top: ${UI_CONSTANTS.SPOKE_START_TOP + (idx * UI_CONSTANTS.SPOKE_SPACING)}px; left: 30px;">
                        <div class="spoke-icon">🔧</div>
                        <div class="spoke-title">${escapedServerName}</div>
                        <div class="spoke-subtitle">${escapedTransportType}</div>
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

function renderHubDetails(markdownBody) {
    const sections = parseMarkdownSections(markdownBody);
    const renderedRole = sections.role ? convertMarkdownToHtml(sections.role) : '<p class="text-muted">No role defined</p>';
    const renderedInstructions = sections.instructions ? convertMarkdownToHtml(sections.instructions) : '<p class="text-muted">No instructions defined</p>';
    
    return {
        title: '<i class="bi bi-robot me-2"></i>Agent Core',
        html: `
            <div class="detail-form">
                <div class="mb-3">
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-person-badge me-2 text-primary"></i>
                        <h6 class="mb-0 fw-bold">Role</h6>
                    </div>
                    <div class="markdown-content border rounded p-3 bg-light" style="height: ${UI_CONSTANTS.ROLE_HEIGHT}px; overflow-y: auto;">
                        ${renderedRole}
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-list-check me-2 text-success"></i>
                        <h6 class="mb-0 fw-bold">Instructions</h6>
                    </div>
                    <div class="markdown-content border rounded p-3 bg-light" style="height: ${UI_CONSTANTS.INSTRUCTIONS_HEIGHT}px; overflow-y: auto;">
                        ${renderedInstructions}
                    </div>
                </div>
                
                <div class="alert alert-info mb-0">
                    <i class="bi bi-info-circle me-2"></i>
                    The role and instructions define the agent's behavior and purpose. This is the core system prompt.
                </div>
            </div>
        `
    };
}

function renderMcpDetails(mcpServer) {
    if (!mcpServer) {
        return {
            title: '<i class="bi bi-diagram-3 me-2"></i>MCP Server',
            html: '<p class="text-muted">Server not found</p>'
        };
    }
    
    return {
        title: `<i class="bi bi-diagram-3 me-2"></i>MCP Server: ${escapeHtml(mcpServer.name)}`,
        html: renderMcpDetailsHtml(mcpServer)
    };
}

// Helper to highlight variable substitutions
function highlightVars(val) {
    if (typeof val !== 'string') return escapeHtml(val);
    return escapeHtml(val).replace(/(\$\{[^}]+\})/g, '<span class="badge bg-warning text-dark" title="Variable substitution">$1</span>');
}


function renderInterfaceDetails(interfaceConfig) {
    const interfaceExposure = interfaceConfig?.exposure || {};
    const interfaceSignature = interfaceConfig?.signature;
    const interfaceTypeValue = interfaceConfig?.type || 'function';
    
    return {
        title: '<i class="bi bi-broadcast me-2"></i>Agent Interface',
        html: `
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
        `
    };
}

function showSpokeDetails(spokeType, spokeIndex) {
    const detailsTitle = document.getElementById('spoke-details-title');
    const detailsContent = document.getElementById('spoke-details-content');
    
    const { metadata, markdownBody } = currentAfmData;
    
    // Render details based on spoke type
    let result;
    switch(spokeType) {
        case 'hub': {
            result = renderHubDetails(markdownBody);
            break;
        }
        case 'mcp': {
            const mcpServer = metadata.tools?.mcp?.servers?.[spokeIndex];
            result = renderMcpDetails(mcpServer);
            break;
        }
        case 'interface': {
            result = renderInterfaceDetails(metadata.interface);
            break;
        }
        default: {
            result = {
                title: '<i class="bi bi-info-circle me-2"></i>Details',
                html: '<p class="text-muted">No details available</p>'
            };
        }
    }
    
    detailsTitle.innerHTML = result.title;
    detailsContent.innerHTML = result.html;
}

function renderMetadata(metadata) {
    const container = document.getElementById('metadata-details');
    
    const fields = [
        { label: 'Spec Version', value: metadata.spec_version },
        { label: 'Name', value: metadata.name },
        { label: 'Description', value: metadata.description },
        { label: 'Version', value: metadata.version },
        { label: 'Namespace', value: metadata.namespace },
        { label: 'Author', value: metadata.author },
        { label: 'License', value: metadata.license },
    ];

    const tools = [];
    if (metadata.tools?.mcp?.servers) {
        tools.push(`MCP Servers: ${metadata.tools.mcp.servers.length}`);
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
                ${tools.length > 0 ? `
                    <tr>
                        <th>Tools</th>
                        <td>${tools.join('<br>')}</td>
                    </tr>
                ` : ''}
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

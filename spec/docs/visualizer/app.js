/**
 * Copyright (c) 2025, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const AFM_SPEC_VERSION = '0.3.0';

function renderMcpDetailsHtml(mcpServer) {
    return `
        <div class="detail-form">
            <div class="mb-4">
                <div class="fw-bold mb-1">Server Name</div>
                <div class="form-control form-control-auto-height">${highlightVars(mcpServer.name)}</div>
            </div>

            <div class="mb-4 border rounded p-3">
                <h6 class="fw-bold mb-2">Transport</h6>
                <div class="mb-3">
                    <div class="fw-semibold">Type:</div>
                    <div class="form-control form-control-auto-height mt-1">${escapeHtml(mcpServer.transport?.type || 'stdio')}</div>
                </div>
                ${mcpServer.transport?.command ? `
                <div class="mb-3">
                    <div class="fw-semibold">Command:</div>
                    <div class="form-control form-control-auto-height mt-1">${highlightVars(mcpServer.transport.command)}</div>
                </div>
                ` : ''}
                ${mcpServer.transport?.url ? `
                <div class="mb-3">
                    <div class="fw-semibold">URL:</div>
                    <div class="form-control form-control-auto-height mt-1">${highlightVars(mcpServer.transport.url)}</div>
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
                            <div class="form-control form-control-auto-height mt-1"><code class="arg-value">${highlightVars(arg)}</code></div>
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
                    <div class="form-control form-control-auto-height mt-1">${highlightVars(mcpServer.authentication.type || 'configured')}</div>
                </div>
                ${Object.entries(mcpServer.authentication)
                    .filter(([key]) => key !== 'type')
                    .map(([key, value]) => `
                        <div class="mb-3">
                            <div class="fw-semibold">${escapeHtml(key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '))}:</div>
                            <div class="form-control form-control-auto-height mt-1">${highlightVars(String(value))}</div>
                        </div>
                    `).join('')}
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
    EXECUTION_SPOKE_TOP: 280,
    EXECUTION_LABEL_TOP: 230,
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
spec_version: \"${AFM_SPEC_VERSION}\"
name: \"Code Review Assistant\"
description: \"An AI assistant that helps review code and suggests improvements\"
version: \"1.0.0\"
namespace: \"development-tools\"
author: \"Sample Author <author@example.com>\"
max_iterations: 25
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
          type: \"streamable_http\"
          url: \"\${BASE_URL}/mcp/v1\"
        authentication:
          type: \"bearer\"
          token: \"\${env:API_TOKEN}\"
---

# Role

You are a Code Review Assistant specializing in providing constructive feedback on code quality, best practices, and potential improvements.

# Instructions

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
        
        // Strip raw HTML blocks from markdown - DOMPurify will handle sanitization
        // This prevents any inline HTML/scripts in the markdown from being parsed
        if (marked.use) {
            marked.use({
                renderer: {
                    html(html) {
                        // Strip raw HTML blocks - return empty string
                        return '';
                    }
                }
            });
        }
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
        if (!localStorage.getItem('afm-theme')) {
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
    
    const versionBadge = document.querySelector('.navbar .badge');
    if (versionBadge) {
        versionBadge.textContent = `Spec v${AFM_SPEC_VERSION}`;
    }
    
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
    const sanitizedTitle = typeof DOMPurify !== 'undefined' 
        ? DOMPurify.sanitize(title, { ALLOWED_TAGS: ['strong', 'em', 'code'], ALLOWED_ATTR: [] })
        : escapeHtml(title);
    const sanitizedMessage = typeof DOMPurify !== 'undefined'
        ? DOMPurify.sanitize(message, { 
            ALLOWED_TAGS: ['p', 'strong', 'em', 'code', 'ul', 'ol', 'li', 'div', 'pre'],
            ALLOWED_ATTR: ['class']
          })
        : escapeHtml(message);
    
    // Create a Bootstrap-style modal
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="modal fade show modal-overlay" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-exclamation-triangle me-2"></i>${sanitizedTitle}
                        </h5>
                        <button type="button" class="btn-close btn-close-white"></button>
                    </div>
                    <div class="modal-body">
                        ${sanitizedMessage}
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

# Instructions

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

        if (typeof metadata !== 'object' || Array.isArray(metadata)) {
            throw new Error('YAML frontmatter must be an object');
        }
    } catch (error) {
        if (error.name === 'YAMLException') {
            throw new Error('Invalid YAML syntax in frontmatter: ' + error.message);
        }
        throw new Error('Failed to parse YAML frontmatter: ' + error.message);
    }

    const allowedTypes = ['function', 'service', 'chat', 'webhook'];
    if (Object.prototype.hasOwnProperty.call(metadata, 'interface')) {
        const iface = metadata.interface;
        if (!iface || typeof iface !== 'object' || Array.isArray(iface)) {
            throw new Error('interface must be an object if present');
        }
        if (!iface.type || !allowedTypes.includes(iface.type)) {
            throw new Error(`interface.type must be one of: ${allowedTypes.join(', ')}`);
        }
        if (iface.signature !== undefined) {
            if (typeof iface.signature !== 'object' || Array.isArray(iface.signature)) {
                throw new Error('interface.signature must be an object if present');
            }
            // For webhook, input MAY be omitted
            if (iface.type !== 'webhook') {
                if (!iface.signature.input || typeof iface.signature.input !== 'object') {
                    throw new Error('interface.signature.input must be an object for function, chat, and service types');
                }
                if (!iface.signature.output || typeof iface.signature.output !== 'object') {
                    throw new Error('interface.signature.output must be an object for function, chat, and service types');
                }
            } else {
                if (iface.signature.input !== undefined && typeof iface.signature.input !== 'object') {
                    throw new Error('interface.signature.input must be an object if present for webhook type');
                }
                if (!iface.signature.output || typeof iface.signature.output !== 'object') {
                    throw new Error('interface.signature.output must be an object for webhook type');
                }
            }
        }
        if (iface.type === 'webhook') {
            if (!iface.subscription || typeof iface.subscription !== 'object' || Array.isArray(iface.subscription)) {
                throw new Error('interface.subscription is required and must be an object for webhook type');
            }
            if (!iface.subscription.protocol) {
                throw new Error('interface.subscription.protocol is required for webhook type');
            }
            if (!iface.subscription.hub) {
                throw new Error('interface.subscription.hub is required for webhook type');
            }
        }
    }

    const markdownBody = parts.slice(2).join('---').trim();
    if (!markdownBody) {
        console.warn('AFM file has no markdown content');
    }

    // Validate markdown body sections (SHOULD contain Role and Instructions)
    const sections = parseMarkdownSections(markdownBody);
    if (!sections.role && !sections.instructions) {
        console.warn('AFM file should contain # Role and # Instructions sections in the markdown body');
    } else if (!sections.role) {
        console.warn('AFM file should contain a # Role section in the markdown body');
    } else if (!sections.instructions) {
        console.warn('AFM file should contain an # Instructions section in the markdown body');
    }

    // Apply spec defaults
    metadata = applySpecDefaults(metadata, markdownBody);

    return {
        metadata,
        markdownBody,
        rawContent: content
    };
}

/**
 * Apply AFM specification defaults to metadata
 */
function applySpecDefaults(metadata, markdownBody) {
    const defaults = { ...metadata };

    // Default: name inferred from filename (handled by caller, but fallback to "Unnamed Agent")
    if (!defaults.name) {
        defaults.name = 'Unnamed Agent';
    }

    // Default: description inferred from markdown body # Role section
    if (!defaults.description && markdownBody) {
        const sections = parseMarkdownSections(markdownBody);
        if (sections.role) {
            // Take first sentence or first 100 characters
            const firstLine = sections.role.split('\n')[0];
            defaults.description = firstLine.length > 100
                ? firstLine.substring(0, 97) + '...'
                : firstLine;
        }
    }

    // Default: version is "0.0.0"
    if (!defaults.version) {
        defaults.version = '0.0.0';
    }

    // Default: namespace is "default"
    if (!defaults.namespace) {
        defaults.namespace = 'default';
    }

    // Default: interface type is "function" with string input/output signature
    if (!defaults.interface) {
        defaults.interface = {
            type: 'function',
            signature: {
                input: {
                    type: 'string'
                },
                output: {
                    type: 'string'
                }
            }
        };
    } else if (defaults.interface && !defaults.interface.signature) {
        // If interface exists but no signature, apply default signature based on type
        const ifaceType = defaults.interface.type || 'function';

        // For function, chat, and service: default is string input/output
        if (ifaceType !== 'webhook') {
            defaults.interface.signature = {
                input: {
                    type: 'string'
                },
                output: {
                    type: 'string'
                }
            };
        }
    }

    return defaults;
}

function showUploadSection() {
    document.getElementById('upload-section').classList.remove('d-none');
    document.getElementById('visualizer-section').classList.remove('active');
    document.getElementById('file-input').value = '';
}

function showVisualizerSection() {
    document.getElementById('upload-section').classList.add('d-none');
    document.getElementById('visualizer-section').classList.add('active');
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
    // Split by top-level headers (single # at line start, not ##)
    const sections = markdown.split(/\n(?=# [^#])/);
    
    const result = { role: '', instructions: '' };
    
    for (const section of sections) {
        if (section.startsWith('# Role')) {
            result.role = section.replace(/^# Role\s*\n/, '').trim();
        } else if (section.match(/^# Instructions?\b/)) {
            result.instructions = section.replace(/^# Instructions?\s*\n/, '').trim();
        }
    }
    
    return result;
}

function convertMarkdownToHtml(text) {
    // Use marked library for proper markdown parsing
    if (typeof marked !== 'undefined' && marked.parse) {
        try {
            const rawHtml = marked.parse(text);
            if (typeof DOMPurify !== 'undefined') {
                return DOMPurify.sanitize(rawHtml, {
                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                                   'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'hr', 
                                   'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'],
                    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
                });
            }
            // If DOMPurify is not available, throw error rather than using unsafe HTML
            console.error('DOMPurify not available - cannot safely render markdown');
            throw new Error('DOMPurify library required for safe markdown rendering');
        } catch (error) {
            console.error('Markdown parsing/sanitization error:', error);
            // Fall through to safe fallback
        }
    }
    // Fallback: basic HTML with line breaks preserved (safe - no user HTML)
    console.warn('Marked library not available, using safe fallback');
    return '<p>' + escapeHtml(text).replace(/\n/g, '<br>') + '</p>';
}

function renderHubSpoke(metadata, markdownBody) {
    const container = document.getElementById('hub-spoke-container');
    
    const mcpServers = metadata.tools?.mcp?.servers || [];
    const hasInterface = metadata.interface;
    const interfaceType = metadata.interface?.type || 'function';
    const hasExecutionConfig = metadata.max_iterations !== undefined;

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
                ${hasExecutionConfig ? '<line x1="600" y1="450" x2="1010" y2="380" class="connection-line-interface" stroke-width="2.5" />' : ''}
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
                        ${interfaceType === 'function' ? '<i class="bi bi-code-square"></i>' : ''}
                        ${interfaceType === 'service' ? '<i class="bi bi-cloud"></i>' : ''}
                        ${interfaceType === 'chat' ? '<i class="bi bi-chat-dots"></i>' : ''}
                        ${interfaceType === 'webhook' ? '<i class="bi bi-broadcast"></i>' : ''}
                    </div>
                    <div class="spoke-subtitle">${escapedInterfaceType}</div>
                </div>
                ` : ''}
                ${hasExecutionConfig ? `
                <div class="spoke-group-label" style="position: absolute; top: ${UI_CONSTANTS.EXECUTION_LABEL_TOP}px; right: 30px;">Execution</div>
                <div class="spoke spoke-execution" data-spoke-type="execution" style="position: absolute; top: ${UI_CONSTANTS.EXECUTION_SPOKE_TOP}px; right: 30px;">
                    <div class="spoke-icon">
                        <i class="bi bi-gear-fill"></i>
                    </div>
                    <div class="spoke-subtitle">max_iterations: ${metadata.max_iterations}</div>
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
                    <div class="markdown-content markdown-role-content border rounded p-3 bg-light">
                        ${renderedRole}
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-list-check me-2 text-success"></i>
                        <h6 class="mb-0 fw-bold">Instructions</h6>
                    </div>
                    <div class="markdown-content markdown-instructions-content border rounded p-3 bg-light">
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

function renderExecutionConfigDetails(metadata) {
    const maxIterations = metadata.max_iterations;
    
    return {
        title: '<i class="bi bi-gear-fill me-2"></i>Execution Configuration',
        html: `
            <div class="detail-form">
                <h6 class="text-muted mb-3">Runtime Control Settings</h6>
                <div class="row mb-3">
                    <label class="col-sm-4 col-form-label fw-bold">Max Iterations</label>
                    <div class="col-sm-8">
                        <div class="form-control form-control-auto-height">${maxIterations !== undefined ? escapeHtml(String(maxIterations)) : '<span class="text-muted">Not set (unlimited)</span>'}</div>
                    </div>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    The max_iterations setting prevents infinite loops by limiting how many iteration cycles the agent can perform in a single invocation. If not set, implementations may allow unlimited iterations or apply their own default limits.
                </div>
            </div>
        `
    };
}

// Helper to highlight variable substitutions
function highlightVars(val) {
    if (typeof val !== 'string') return escapeHtml(val);
    return escapeHtml(val).replace(/(\$\{[^}]+\})/g, '<span class="badge badge-var-interp" title="Variable substitution">$1</span>');
}


function renderSchemaDetails(schema, isNested = false) {
    if (!schema) return '<span class="text-muted">No schema</span>';
    if ((schema.type === 'object' && schema.properties) || schema.properties) {
        const req = Array.isArray(schema.required) ? schema.required : [];
        return `
            ${!isNested ? `
            <div class="row mb-3">
                <label class="col-sm-3 col-form-label fw-bold">Type</label>
                <div class="col-sm-9">
                    <div class="form-control form-control-auto-height">${escapeHtml(schema.type || 'object')}</div>
                </div>
            </div>
            ` : ''}
            <div class="table-responsive">
                <table class="table table-sm table-bordered">
                    <thead>
                        <tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        ${Object.entries(schema.properties).map(([propName, propSchema]) => {
                            const constraints = renderPropertyConstraints(propSchema);
                            return `
                            <tr>
                                <td><code>${escapeHtml(propName)}</code></td>
                                <td>${escapeHtml(propSchema.type || typeof propSchema)}${constraints ? `<br><small class="text-muted">${constraints}</small>` : ''}</td>
                                <td>${req.includes(propName) ? '<span class="badge bg-danger">Required</span>' : '<span class="badge bg-secondary">Optional</span>'}</td>
                                <td>${escapeHtml(propSchema.description || '-')}</td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    if (schema.type === 'array') {
        const itemsSchema = schema.items;

        if (!itemsSchema) {
            return `
                <div class="row mb-3">
                    <label class="col-sm-3 col-form-label fw-bold">Type</label>
                    <div class="col-sm-9">
                        <div class="form-control form-control-auto-height">${escapeHtml(schema.type)}</div>
                    </div>
                </div>
            `;
        }

        const itemType = itemsSchema.type || 'unknown';
        const itemConstraints = renderPropertyConstraints(itemsSchema);

        // If items is an object with properties, show them in a nested table
        if ((itemType === 'object' && itemsSchema.properties) || itemsSchema.properties) {
            return `
                <div class="row mb-3">
                    <label class="col-sm-3 col-form-label fw-bold">Type</label>
                    <div class="col-sm-9">
                        <div class="form-control form-control-auto-height">
                            ${escapeHtml(schema.type)}
                            <div class="mt-2 pt-2 border-top">
                                <div class="fw-semibold mb-2">Member Type: ${escapeHtml(itemType)}</div>
                                ${renderSchemaDetails(itemsSchema, true)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Simple item type (string, number, etc.)
        return `
            <div class="row mb-3">
                <label class="col-sm-3 col-form-label fw-bold">Type</label>
                <div class="col-sm-9">
                    <div class="form-control form-control-auto-height">
                        ${escapeHtml(schema.type)}
                        <div class="mt-2 pt-2 border-top">
                            <div class="fw-semibold mb-1">Member Type</div>
                            <div>${escapeHtml(itemType)}${itemConstraints ? `<br><small class="text-muted">${itemConstraints}</small>` : ''}</div>
                            ${itemsSchema.description ? `<div class="mt-1"><small class="text-muted">${escapeHtml(itemsSchema.description)}</small></div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // Primitive type or unknown
    const constraints = renderPropertyConstraints(schema);
    return `
        <div class="row mb-3">
            <label class="col-sm-3 col-form-label fw-bold">Type</label>
            <div class="col-sm-9">
                <div class="form-control form-control-auto-height">${escapeHtml(schema.type || typeof schema)}${constraints ? `<br><small class="text-muted">${constraints}</small>` : ''}</div>
            </div>
        </div>
    `;
}

// Helper to render property constraints
function renderPropertyConstraints(schema) {
    const constraints = [];
    const skipKeys = new Set(['type', 'description', 'properties', 'items', 'required']);
    for (const key in schema) {
        if (skipKeys.has(key)) continue;
        let value = schema[key];
        if (Array.isArray(value)) {
            value = value.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(', ');
        } else if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        constraints.push(`<strong>${escapeHtml(key)}:</strong> <code>${escapeHtml(value)}</code>`);
    }
    return constraints.length ? constraints.join(' | ') : '';
}

function renderInterfaceDetails(interfaceConfig) {
    const interfaceExposure = interfaceConfig?.exposure || {};
    const interfaceSignature = interfaceConfig?.signature;
    const interfaceTypeValue = interfaceConfig?.type || 'function';

    let subscriptionHtml = '';
    if (interfaceTypeValue === 'webhook' && interfaceConfig.subscription) {
        const sub = interfaceConfig.subscription;
        subscriptionHtml = `
            <hr class="my-4">
            <h6 class="text-muted mb-3">Webhook Subscription</h6>
            <div class="mb-3 row">
                <label class="col-sm-3 col-form-label fw-bold">Protocol</label>
                <div class="col-sm-9"><div class="form-control form-control-auto-height">${highlightVars(sub.protocol || '')}</div></div>
            </div>
            <div class="mb-3 row">
                <label class="col-sm-3 col-form-label fw-bold">Hub</label>
                <div class="col-sm-9"><div class="form-control form-control-auto-height">${highlightVars(sub.hub || '')}</div></div>
            </div>
            ${sub.topic ? `<div class="mb-3 row"><label class="col-sm-3 col-form-label fw-bold">Topic</label><div class="col-sm-9"><div class="form-control form-control-auto-height">${highlightVars(sub.topic)}</div></div></div>` : ''}
            ${sub.callback ? `<div class="mb-3 row"><label class="col-sm-3 col-form-label fw-bold">Callback</label><div class="col-sm-9"><div class="form-control form-control-auto-height">${highlightVars(sub.callback)}</div></div></div>` : ''}
            ${sub.secret ? `<div class="mb-3 row"><label class="col-sm-3 col-form-label fw-bold">Secret</label><div class="col-sm-9"><div class="form-control form-control-auto-height">${highlightVars(sub.secret)}</div></div></div>` : ''}
        `;
    }
    return {
        title: '<i class="bi bi-broadcast me-2"></i>Agent Interface',
        html: `
            <div class="detail-form">
                <h6 class="text-muted mb-3">Interface Configuration</h6>
                <div class="row mb-3">
                    <label class="col-sm-3 col-form-label fw-bold">Type</label>
                    <div class="col-sm-9">
                        <div class="form-control form-control-auto-height">${highlightVars(interfaceTypeValue)}</div>
                    </div>
                </div>
                ${interfaceSignature ? `
                    <hr class="my-4">
                    <h6 class="text-muted mb-3">Signature</h6>
                    <div class="mb-4">
                        <label class="form-label fw-bold">Input</label>
                        ${renderSchemaDetails(interfaceSignature.input)}
                    </div>
                    <div class="mb-4">
                        <label class="form-label fw-bold">Output</label>
                        ${renderSchemaDetails(interfaceSignature.output)}
                    </div>
                ` : ''}
                ${subscriptionHtml}
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
                                        <div class="form-control form-control-auto-height">HTTP</div>
                                    </div>
                                </div>
                                ${config.path ? `
                                <div class="row mb-3">
                                    <label class="col-sm-3 col-form-label fw-bold">Path</label>
                                    <div class="col-sm-9">
                                        <div class="form-control form-control-auto-height">${highlightVars(config.path)}</div>
                                    </div>
                                </div>
                                ` : ''}
                                ${config.port ? `
                                <div class="row mb-3">
                                    <label class="col-sm-3 col-form-label fw-bold">Port</label>
                                    <div class="col-sm-9">
                                        <div class="form-control form-control-auto-height">${highlightVars(String(config.port))}</div>
                                    </div>
                                </div>
                                ` : ''}
                                ${config.authentication ? `
                                <div class="row mb-3">
                                    <label class="col-sm-3 col-form-label fw-bold">Authentication</label>
                                    <div class="col-sm-9">
                                        <div class="border rounded p-3 bg-white">
                                            <div class="mb-2">
                                                <div class="fw-semibold">Type:</div>
                                                <div class="form-control form-control-auto-height mt-1">${highlightVars(config.authentication.type || 'configured')}</div>
                                            </div>
                                            ${Object.entries(config.authentication)
                                                .filter(([key]) => key !== 'type')
                                                .map(([key, value]) => `
                                                    <div class="mb-2">
                                                        <div class="fw-semibold">${escapeHtml(key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '))}:</div>
                                                        <div class="form-control form-control-auto-height mt-1">${highlightVars(String(value))}</div>
                                                    </div>
                                                `).join('')}
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
                                        <div class="form-control form-control-auto-height">A2A</div>
                                    </div>
                                </div>
                                ${config.endpoint ? `
                                <div class="row mb-3">
                                    <label class="col-sm-3 col-form-label fw-bold">Endpoint</label>
                                    <div class="col-sm-9">
                                        <div class="form-control form-control-auto-height">${highlightVars(config.endpoint)}</div>
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
                                        <div class="form-control form-control-auto-height">${highlightVars(type.toUpperCase())}</div>
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
        case 'execution': {
            result = renderExecutionConfigDetails(metadata);
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

# Agent-Flavored Markdown (AFM)

A markdown-based format for portable and interoperable definitions of AI agents using natural language.

## Overview

This repository contains the **AFM Specification** and its documentation website built with [MkDocs](https://www.mkdocs.org/).

**Repository Structure:**
- `docs/specification.md` - **The AFM Specification** (core document)
- `docs/visualizer/` - Interactive AFM file visualizer
- `docs/` - Additional documentation and guides
- `mkdocs.yml` - Documentation site configuration
- `requirements.txt` - Python dependencies
- `Dockerfile` - Development server container

## Quick Start

### Local Development

**Prerequisites:** Python 3.8+

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the development server:**
   ```bash
   mkdocs serve
   ```

3. **Access the site:**
   Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser

The server will automatically reload when you make changes to the source files.

### Docker Development

**Build the image:**
```bash
docker build -t afm-spec .
```

**Run the container:**
```bash
docker run --rm -p 8000:8000 afm-spec
```

**Access the site:**
Open [http://localhost:8000](http://localhost:8000) in your browser

> **Tip:** Use `--rm` flag to automatically remove the container when stopped, preventing container accumulation.

## Building for Production

Generate static HTML files:
```bash
mkdocs build
```

The output will be in the `site/` directory.

## Contributing

Please read the [AFM Specification](https://wso2.github.io/agent-flavored-markdown/) for details on the format and structure.

## License

See [LICENSE.md](LICENSE.md) for details.

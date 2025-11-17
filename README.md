# Agent-Flavored Markdown (AFM)

A markdown-based approach for portable and interoperable definitions of AI agents using natural language.

## Overview

This repository contains the AFM specification website (MkDocs) and its source.

Contents:
- mkdocs.yml (site configuration)
- docs/ (site source)
- requirements.txt (Python dependencies for building the site)
- Dockerfile (dev server image that runs `mkdocs serve`)

Quick local build
1. Create a Python environment and install dependencies:
   pip install -r requirements.txt

2. Run the live dev server:
   mkdocs serve

The site will be available at http://127.0.0.1:8000 by default.

Docker (dev server)
- Build: docker build -t afm-spec .
- Run:  docker run -p 8000:8000 afm-spec

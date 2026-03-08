# Scripts

This directory contains utility scripts for the Infinitunes project.

## stage-reference.sh

Stages external reference repository code for AI-assisted framework migrations.

### Purpose

When migrating to a new framework (e.g., Astro), AI agents often need access to reference implementations from other codebases. This script standardizes the process of importing external reference code into the project workspace without polluting git history.

### Usage

```bash
./scripts/stage-reference.sh
```

The script will:
1. Create a `_reference/podcastify` directory at the project root
2. Prompt you for the local path to the `podcastify-website` repository
3. Copy the contents of that repository into `_reference/podcastify`
4. Update `.gitignore` to exclude `_reference/` from version control

### Example

```bash
$ ./scripts/stage-reference.sh

=== Infinitunes AI Reference Material Staging ===

[1/4] Creating reference directory structure...
✓ Created /path/to/infinitunes/_reference/podcastify

[2/4] Please provide the local file path to the podcastify-website repository:
Path: /home/user/projects/podcastify-website

[3/4] Copying repository contents...
Using rsync...
✓ Repository contents copied successfully

[4/4] Updating .gitignore...
✓ Added _reference/ to .gitignore

╔══════════════════════════════════════════════════════════════╗
║                   ✓ Workspace Staged!                       ║
╚══════════════════════════════════════════════════════════════╝

Reference material location: /path/to/infinitunes/_reference/podcastify
Status: Ready for AI-assisted framework migration

You can now run your AI agent with the Master Retrofit Prompt.
The agent will have access to podcastify patterns in: _reference/podcastify/
```

### Notes

- The script will exclude `.git`, `node_modules`, `.next`, `dist`, and `build` directories from the copy
- Requires `rsync` for optimal performance (falls back to `cp` if unavailable)
- The `_reference/` directory is automatically gitignored and should never be committed
- The reference code is read-only context for AI agents - they should not modify it

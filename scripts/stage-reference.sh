#!/bin/bash

set -e

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Infinitunes AI Reference Material Staging ===${NC}\n"

# Get the project root (directory where this script is located, then go up one level)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Define the reference directory path
REFERENCE_DIR="${PROJECT_ROOT}/_reference/podcastify"

# Step 1: Create the _reference/podcastify directory
echo -e "${BLUE}[1/4]${NC} Creating reference directory structure..."
mkdir -p "${REFERENCE_DIR}"
echo -e "${GREEN}✓${NC} Created ${REFERENCE_DIR}\n"

# Step 2: Prompt user for the podcastify-website repository path
echo -e "${BLUE}[2/4]${NC} Please provide the local file path to the podcastify-website repository:"
read -r -p "Path: " SOURCE_PATH

# Validate that the path exists
if [ ! -d "${SOURCE_PATH}" ]; then
    echo -e "${RED}✗${NC} Error: Directory '${SOURCE_PATH}' does not exist."
    exit 1
fi

# Check if the source path looks like a git repository (optional validation)
if [ ! -d "${SOURCE_PATH}/.git" ]; then
    echo -e "${YELLOW}⚠${NC}  Warning: '${SOURCE_PATH}' doesn't appear to be a git repository."
    read -r -p "Continue anyway? (y/n): " CONTINUE
    if [[ ! "${CONTINUE}" =~ ^[Yy]$ ]]; then
        echo -e "${RED}✗${NC} Aborted by user."
        exit 1
    fi
fi

# Step 3: Copy the contents using rsync (with progress) or fallback to cp
echo -e "\n${BLUE}[3/4]${NC} Copying repository contents..."
if command -v rsync &> /dev/null; then
    echo -e "${BLUE}Using rsync...${NC}"
    rsync -av --progress "${SOURCE_PATH}/" "${REFERENCE_DIR}/" \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='dist' \
        --exclude='build'
else
    echo -e "${YELLOW}rsync not found, using cp...${NC}"
    cp -R "${SOURCE_PATH}/." "${REFERENCE_DIR}/"
fi
echo -e "${GREEN}✓${NC} Repository contents copied successfully\n"

# Step 4: Update .gitignore if needed
GITIGNORE_PATH="${PROJECT_ROOT}/.gitignore"
echo -e "${BLUE}[4/4]${NC} Updating .gitignore..."

if [ -f "${GITIGNORE_PATH}" ]; then
    # Check if _reference/ is already in .gitignore
    if grep -q "^_reference/" "${GITIGNORE_PATH}"; then
        echo -e "${YELLOW}ℹ${NC}  _reference/ already exists in .gitignore"
    else
        # Append _reference/ to .gitignore with a comment
        {
            echo ""
            echo "# AI Reference Material"
            echo "_reference/"
        } >> "${GITIGNORE_PATH}"
        echo -e "${GREEN}✓${NC} Added _reference/ to .gitignore"
    fi
else
    echo -e "${RED}✗${NC} Warning: .gitignore file not found at ${GITIGNORE_PATH}"
fi

# Final success message
echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   ✓ Workspace Staged!                       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}Reference material location:${NC} ${REFERENCE_DIR}"
echo -e "${BLUE}Status:${NC} Ready for AI-assisted framework migration\n"
echo -e "You can now run your AI agent with the Master Retrofit Prompt."
echo -e "The agent will have access to podcastify patterns in: ${YELLOW}_reference/podcastify/${NC}\n"

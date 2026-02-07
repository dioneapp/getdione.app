---
title: "Creating a Dione Script"
description: "This guide explains how to create a valid configuration file for applications on the Dione platform."
layout: ../../layouts/DocsLayout.astro
order: 1
---

# Creating a Dione Script

This guide explains how to create a valid `dione.json` configuration file. This JSON file defines your application's dependencies, installation steps, environment setup, and startup commands.

## File Structure

The configuration file must follow this structure:

```json
{
  "requirements": { ... },
  "dependencies": { ... },
  "installation": [ ... ],
  "start": [ ... ]
}
```

---

## 1. Requirements

This section checks if the user's device meets the necessary hardware or OS requirements.

### Format

-   **Key**: Requirement name (e.g., `gpus`).
-   **Value**: Array of supported values. An empty array `[]` means no restriction.

| Requirement | Description | Example Values |
| :--- | :--- | :--- |
| `gpus` | Supported GPU vendors | `["nvidia", "amd"]` |
| `os` | Supported Operating Systems | `["windows", "linux"]` |

### Example

```json
"requirements": {
    "gpus": ["nvidia", "amd"],
    "os": ["windows"] // Only runs on Windows
}
```

---

## 2. Dependencies

Dione automatically installs these external tools if they are missing.

### Available Dependencies

| Dependency | Description |
| :--- | :--- |
| `git` | Git version control system |
| `git_lfs` | Git Large File Storage |
| `conda` | Conda package manager |
| `uv` | Fast Python package installer (Recommended) |
| `ffmpeg` | Multimedia framework |
| `node` | Node.js runtime |
| `pnpm` | Fast package manager for Node |
| `build_tools`| Visual Studio Build Tools (Windows) |
| `cuda` | CUDA Toolkit for NVIDIA GPUs |
| `ollama` | Ollama server for running LLMs |

### Example

```json
"dependencies": {
  "git": { "version": "latest" }
}
```

---

## 3. Installation

Defines the steps to install and set up the application.

### Step Properties

Each installation step is an object with the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | **Required**. Human-readable description of the step. |
| `commands` | Array | **Required**. List of commands to execute. |
| `env` | Object/String | Environment to run commands in (details below). |
| `parallel` | Boolean | If `true`, runs commands simultaneously. Default: `false`. |
| `variables` | Array | List of environment variables to set for this step. |

### The `env` Object

The `env` property allows you to create isolated environments.
-   **Structure**: `{ "name": "env_name", "type": "uv" | "conda", "version": "3.10" }`
-   **Usage**: If specified, all commands in the step run inside this environment.

### Command Format

Commands can be simple strings or objects for platform specifics:
-   **String**: `"pip install -r requirements.txt"`
-   **Object**:
    ```json
    {
      "platform": "windows",
      "gpus": "nvidia",
      "command": "pip install torch --index-url ..."
    }
    ```

### Example

```json
"installation": [
  {
    "name": "Cloning repository",
    "commands": ["git clone https://github.com/myshell-ai/MeloTTS.git melotts"]
  },
  {
    "name": "Installing requirements",
    "env": { "name": "env", "version": "3.10", "type": "uv" },
    "variables": [
      { "key": "MODEL_PATH", "value": "./models" }
    ],
    "commands": ["cd melotts", "uv pip install -e ."]
  }
]
```

---

## 4. Start

Defines how to launch the application. You can provide multiple start options (e.g., "Default", "Debug", "Custom Port").

### Step Properties

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | **Required**. Name of the start option. |
| `commands` | Array | List of commands to execute. |
| `catch` | String/Number | Port or keyword Dione monitors to know the app is ready. |
| `env` | Object/String | Environment to activate (reuse the one from Installation). |
| `steps` | Array | For complex startup sequences involving multiple stages. |
| `customizable`| Boolean | If `true` on a command object, allows user input. |

### Customizable Commands

Allow users to modify parameters before launch:

```json
{
  "command": "python main.py --port 8080",
  "customizable": true
}
```

### Examples

**Simple Start:**

```json
"start": [
  {
    "name": "Starting MeloTTS",
    "catch": "8888",
    "env": "env",
    "commands": ["cd melotts/melo", "uv run app.py --port 8888"]
  }
]
```

**Multiple & Customizable Start:**

```json
"start": [
  {
    "name": "Default Start",
    "catch": "8188",
    "env": "env",
    "commands": ["cd melotts/melo", "uv run app.py --port 8188"]
  },
  {
    "name": "Start with Params",
    "catch": "8288",
    "env": "env",
    "steps": [
      {
        "name": "Starting",
        "commands": [
          "cd melotts/melo",
          { "command": "uv run app.py --port 8288", "customizable": true }
        ]
      }
    ]
  }
]
```

---

## Full Example

```json
{
  "requirements": {
    "gpus": ["nvidia", "amd"],
    "os": ["windows", "linux"]
  },
  "dependencies": {
    "git": { "version": "latest" },
    "uv": { "version": "latest" }
  },
  "installation": [
    {
      "name": "Cloning repository",
      "commands": ["git clone https://github.com/myshell-ai/MeloTTS.git melotts"]
    },
    {
      "name": "Installing requirements",
      "env": { "name": "env", "version": "3.10" },
      "commands": ["cd melotts", "uv pip install -e .", "python -m unidic download"]
    }
  ],
  "start": [
    {
      "name": "Starting MeloTTS",
      "catch": "8888",
      "env": "env",
      "commands": ["cd melotts/melo", "uv run app.py --port 8888"],
      "variables": [ { "key": "DEV_MODE", "value": "false" } ]
    },
    {
      "name": "Start with Custom Port",
      "catch": "9000",
      "env": "env",
      "commands": ["cd melotts/melo", "uv run app.py --port 9000"]
    }
  ]
}
```

## Tips & Best Practices

-   **Use descriptive names**: Help users understand what each step does.
-   **Use `env` blocks**: Isolate dependencies to avoid conflicts.
-   **Use `catch`**: Ensure Dione knows when to show the "Open" button.
-   **Test compatibility**: Verify commands on all supported platforms (Windows/Linux).

---

## Submitting Your Script

[Watch our video tutorial](https://youtu.be/_d63F9ZWdfg) or follow these steps:

1.  **Upload to GitHub**: Host your `dione.json` in a public repository.
2.  **Go to Dione**: Navigate to your [Account > Scripts](https://getdione.app/profile).
3.  **Submit**: Click "Submit Script".
4.  **Fill Details**: 
    -   Enter the repository URL.
    -   **Important**: Fill the "commit hash" field with the latest commit hash to strictly version your script (security requirement).
5.  **Review**: Click "Submit for review". Your script will be reviewed shortly.
---
title: "Creating a Dione Script"
description: "This guide explains how to create a valid configuration file for applications on the Dione platform."
layout: ../../layouts/DocsLayout.astro
order: 1
---

# Creating a Dione Script

This guide explains how to create a valid `dione.json` configuration file to run applications on the Dione platform. This file, written in JSON format, describes the application's dependencies, installation steps, environment setup, and startup commands.

---

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

Each section is explained in detail below.

---

## Requirements

This section lists the system requirements necessary to run the app. Dione checks if the app is compatible with the user's device and displays a message if it's not.

### Format

-   **Key**: The requirement name (e.g., `gpus`).
-   **Value**: An array of strings specifying the required GPU vendors (e.g., `nvidia`, `amd`).

### Example

```json
"requirements": {
    "gpus": ["nvidia", "amd"],
    "os": ["windows", "linux"]
}
```

An empty array indicates no restrictions for that requirement (i.e., any GPU or OS is supported).

---

## Dependencies

This section lists external dependencies required by the application. Dione ensures these are installed or notifies the user if they are missing.

### Format

-   **Key**: The dependency name (e.g., `git`).
-   **Value**: An object specifying the version.

### Available Dependencies

The following dependencies are available for use in Dione scripts:

- **git**: Git version control system
- **conda**: Conda package and environment manager
- **uv**: Fast Python package installer and resolver
- **ffmpeg**: Multimedia framework for audio/video processing
- **node**: Node.js JavaScript runtime
- **pnpm**: Fast, disk space efficient package manager
- **build_tools**: Visual Studio Build Tools for Windows

### Example

```json
"dependencies": {
  "git": { "version": "latest" },
  "uv": { "version": "latest" }
}
```

You can specify a version number (e.g., `"3.10"`) instead of `"latest"`.

---

## Installation

This section defines the steps to install and set up the application after cloning its repository.

Each installation step is an object with the following fields:

-   **`name`**: A human-readable description of the step.
-   **`env`** (optional): The environment for executing commands. It can be a string with the environment name or an object with:
    -   `name`: The environment's name.
    -   `type` (default: `uv`): The environment type (`uv` or `conda`).
    -   `version` (default: `latest`): The Python version.
-   **`commands`**: A list of commands to execute. These can be simple strings or objects for platform-specific commands:
    -   `platform`: `windows`, `linux`, or `mac`.
    -   `command`: The command string for that platform.

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
    "commands": ["cd melotts", "uv pip install -e .", "python -m unidic download"]
  }
]
```

When `env` is specified, all commands in that step run within that environment. Dione automatically adds `uv` or `conda` as a dependency if not already listed.

---

## Start

This section defines how to launch the application after installation.

### Keys

-   **`name`**: A description of the launch step.
-   **`catch`** (optional): A port number or keyword for Dione to monitor to detect when the app is running.
-   **`env`** (optional): The name of the environment to activate.
-   **`commands`**: The same format as in the `installation` section.

### Example

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

---

## Tips & Best Practices

-   Use clear and descriptive `name` values for each step.
-   Use `env` blocks for steps requiring a specific interpreter.
-   Provide platform-specific commands where necessary.
-   Use the `catch` key to help Dione detect when the application is ready.
-   Test each command manually on all supported platforms and environments.

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
      "commands": ["cd melotts/melo", "uv run app.py --port 8888"]
    }
  ]
}
```

Create a folder named `melotts` and place the `dione.json` file inside it.

---

## Submitting Your Script

*We're currently building a better submit system. This will provide a more streamlined experience for script creators. Stay tuned for updates on our new submission system!*

For now, to add your application to Dione, submit a pull request to the [Official Dione Scripts](https://github.com/dioneapp/official-scripts) repository.

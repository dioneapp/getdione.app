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
-   **`parallel`** (optional): Whether to run the commands simultaneously (default: `false`).
-   **`commands`**: A list of commands to execute. These can be simple strings or objects for platform-specific commands:
    -   `platform`: `windows`, `linux`, or `mac`.
    -   `gpus`: `nvidia` or `amd`
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

This section defines how to launch the application after installation. You can now define multiple start options to give users different ways to run your application.

### Customizable Commands

Commands can be made customizable to allow users to input custom parameters:

```json
{
  "command": "python main.py --port 8080",
  "customizable": true
}
```

When `customizable` is set to `true`, users will be prompted to modify the command before execution.

---

### Keys

-   **`name`**: A description of the launch step.
-   **`catch`** (optional): A port number or keyword for Dione to monitor to detect when the app is running.
-   **`env`** (optional): The environment to activate. Can be a string with the environment `name` or an object with `name`, `type`, and `version` properties.
-   **`parallel`** (optional): Whether to run the commands simultaneously (default: `false`).
-   **`commands`**: The same format as in the `installation` section (for simple start options). Commands can also be objects with `customizable` and `platform` properties to allow user input and specify platform-specific commands.
-   **`steps`** (optional): An array of steps for complex multi-step startup processes.
-   **`platform`** (optional): The platform to run the script on.

### Simple start example

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

### Multiple Start example

```json
  "start": [
    {
      "name": "Default Start",
      "catch": "8188",
      "env": "env",
      "commands": [
        "cd melotts/melo",
        "uv run app.py --port 8188"
      ]
    },
    {
      "name": "Start with Params",
      "catch": "8288",
      "env": "env",
      "steps": [
        {
          "name": "Starting MeloTTS",
          "commands": [
            "cd melotts/melo",
            { "command": "uv run app.py --port 8288", "customizable": true }
        ]
        }
    ]
    }
  ]
```

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

Create a folder named `melotts` and place the `dione.json` file inside it.

---

## Submitting Your Script

We made a video tutorial for submitting your script, check it out [here](https://youtu.be/_d63F9ZWdfg).

1. Upload your script into a public GitHub repository
2. Go to [Your account page](https://getdione.app/profile) and select "Scripts" tab
3. Click on "Submit Script" button
4. Fill out the form with your script details (important! you must fill "commit hash" field with the commit hash of the last commit, this protect against submitting malicious versions of a script)
5. Click on "Submit for review" button
6. In a short time, your script will be reviewed and approved

We can request changes into your script, if we find any issues or if the script is not up to our standards. Check Scripts tab to see the status of your script and edit it.
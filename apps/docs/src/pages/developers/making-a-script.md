---

title: "Building a script"
description: "This guide explains how to create a valid configuration file for applications built on the Dione platform."
layout: ../../layouts/DocsLayout.astro
order: 1
---

# Building a script

This guide explains how to create a valid configuration file for execute applications on the **Dione** platform. The file should be written in JSON format and describe the required dependencies, installation steps, environment setup, and startup commands for the application.

---

## File Structure

The configuration file should follow this structure:

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

This section lists all system requirements necessary to run an app. Dione will look to see if that app is compatible with your device, if it is not compatible it will display a message.

### Format

* **Key**: the requirement name (e.g., `gpus`)
* **Value**: an array of strings that specifies the required GPU vendors (e.g., `nvidia`, `amd`)

### Example

```json
"requirements": {
    "gpus": ["nvidia", "amd"],
    "os": ["windows","linux"]
}
```

If an array is empty, it indicates that there are no restrictions for that particular requirement (i.e., any GPU or OS is supported).

---

## Dependencies

This section lists all external dependencies that must be available before running the application. Dione will ensure these are installed or notify the user if missing.

### Format

* **Key**: the dependency name (e.g., `git`)
* **Value**: an object that specifies the version

### Example

```json
"dependencies": {
  "git": {
    "version": "latest"
  },
  "uv": {
    "version": "latest"
  }
}
```

You can specify a specific version like `"3.10"` instead of `"latest"` if needed.

---

## Installation

This section defines the steps required to install or set up the application after cloning the repository.

Each installation step should include the following fields:

- **`name`**: A human-readable description of the step.
- **`env`** (optional): Specifies the environment in which the commands should be executed.
  - Can be a simple string with the environment name.
  - Or an object with the following fields:
    - `name`: Name of the environment.
    - `type` (`uv` by default): Environment type, either `uv` or `conda`.
    - `version` (`latest` by default): Python version to use.
- **`commands`**: A list of commands to execute.
  - Can be simple strings (commands).
  - For platform-specific commands, use an object with:
    - `platform`: One of `windows`, `linux`, or `mac`.
    - `command`: The command string for that platform.

### Example

```json
"installation": [
  {
    "name": "Cloning repository",
    "commands": [
      "git clone https://github.com/myshell-ai/MeloTTS.git melotts"
    ]
  },
  {
    "name": "Installing requirements",
    "env": {
      "name": "env",
      "version": "3.10",
      "type": "uv"
    },
    "commands": [
      "cd melotts",
      "uv pip install -e .",
      "python -m unidic download"
    ]
  }
]
```

When `env` is specified, all commands in that step will run within the given environment.
Dione will also add the dependency `uv` or `conda` (if you specify env.type `conda`) to the dependencies automatically, if it is not already specified.

---

## Environment Usage in Start

You can also specify which environment to use when launching your application in the `start` section.

### Example

```json
"start": [
  {
    "name": "Starting MeloTTS",
    "catch": "8888",
    "env": "env",
    "commands": [
      "cd melotts/melo",
      "uv run app.py --port 8888"
    ]
  }
]
```

* **`env`** in a `start` step refers to the environment by name (matching `env.name` in installation).
* Dione will activate this environment before running the commands.

---

## Start

This section defines how to launch the application after installation.

### Keys

* `name`: a description of the launch step
* `catch` (optional): a port number or keyword Dione can watch to detect that the app is running
* `env` (optional): the environment name to activate
* `commands`: same format as in the installation section

### Full Start Example

```json
"start": [
  {
    "name": "Starting MeloTTS",
    "catch": "8888",
    "env": "env",
    "commands": [
      "cd melotts/melo",
      "uv run app.py --port 8888"
    ]
  }
]
```

---

## Tips & Best Practices

* Use clear, descriptive `name` values for each step.
* Include `env` blocks for steps that require a specific interpreter or wrapper.
* Always include platform-specific commands where necessary.
* Use the `catch` key to help Dione detect when the application is ready.
* Test each command manually on each platform and environment.

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
      "commands": [
        "git clone https://github.com/myshell-ai/MeloTTS.git melotts"
      ]
    },
    {
      "name": "Installing requirements",
      "env": { "name": "env", "version": "3.10" },
      "commands": [
        "cd melotts",
        "uv pip install -e .",
        "python -m unidic download"
      ]
    }
  ],
  "start": [
    {
      "name": "Starting MeloTTS",
      "catch": "8888",
      "env": "env",
      "commands": [
        "cd melotts/melo",
        "uv run app.py --port 8888"
      ]
    }
  ]
}
```

Create a folder called `melotts` and place the `dione.json` file inside it.

Now you can make a pull request to the [Official Dione Scripts](https://github.com/dioneapp/official-scripts) to add your application to the list of available applications.

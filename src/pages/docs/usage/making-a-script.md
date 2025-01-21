---
title: Making a Script
order: 3
layout: ../../../layouts/DocsLayout.astro
---

[comment]: <> (Ya cambiaremos esto, es solo orientativo)

# Making a Script

## Creating a Script
Create a `.json` file and name it `dione.json`. 

1. Add a dependency to the script in the `dependencies` field.
```json
 "dependencies": {
        "git": {
            "version": "latest"
        }
    },
```

2. Add a `installation` field to specify the installation method. You can add multiple steps, Dione will execute them sequentially.
```json
    "installation": [
        {
            "name": "Cloning repository",
            "type": "GIT",
            "commands": [
                "git clone https://github.com/iahispano/applio.git applio"
            ]
        },
        {
            "name": "Running 'run-install.bat'",
            "type": "SHELL",
            "commands": [
                "cd applio",
                "run-install.bat"
            ]
        }
    ],
```
3. Add a `start` field to specify the script to run after installation.
```json
    "start": [
            {
                "name": "Running 'run-applio.bat'",
                "type": "SHELL",
                "commands": [
                    "cd applio",
                    "run-applio.bat"
                ]
            }
        ],
```

3. Add a `stop` field to specify the script what to do when user stops the application.
```json
    "stop": [
        {
            "name": "Stopping 'run-applio.bat'",
            "type": "SHELL",
            "commands": [
                "taskkill /F /IM run-applio.bat"
            ]
        }
    ],
```

4. Add a `uninstall` field to specify the script what to do when user uninstalls the application.
```json
    "uninstall": [
        {
            "name": "Uninstalling Applio",
            "type": "SHELL",
            "commands": [
                "rmdir /s /q applio"
            ]
        },
        {
            "name": "Uninstalling Git",
            "type": "SHELL",
            "not-required": true,
            "commands": [
                "start \"C:\\Program Files\\Git\\unins000.exe\""
            ]
        }
    ]
```


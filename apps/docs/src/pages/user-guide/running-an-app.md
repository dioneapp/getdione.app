---
title: Running an App
order: 3
layout: ../../layouts/DocsLayout.astro
description: How to launch, monitor, and stop an app once it's installed via Dione.
---

# Running an App

Once your app is installed, navigate to the **Actions** screen and click the **Start** button. Dione will immediately launch the app and transition to the live overview panel.

![Actions screen](/images/actions-screen.png)

In the overview panel, you'll find the port number for your app. Click the port number to open the application in your web browser. The panel also displays real-time resource usage (CPU, memory, etc.) and provides three control buttons:
-   **Return to Log**: Takes you back to the installation log.
-   **Stop**: Stops the running application.
-   **Reload**: Reloads the interface.

![Started script](/images/started-script.png)

You can switch back to the installation log at any time by clicking the **Return to Log** button, even while the app is running. Non-critical warnings or errors may appear in the log, but they will not interrupt the app's execution.

![Information box](/images/info-screen-on-app.png)

To stop the app, click the **Stop** button in either the overview panel or the log view. If Dione is unable to terminate the process automatically, it will prompt you to stop the application manually.

![Stop app](/images/stop-app.png)

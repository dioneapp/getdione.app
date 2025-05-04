---
title: Running
order: 2
layout: ../../../layouts/DocsLayout.astro
description: How to launch, monitor and stop a script once it’s installed via Dione
---

# Running a Script

Once your app has been installed, head over to the **Actions** screen where the **Start** button awaits. Clicking **Start** will launch your script immediately, and within moments Dione will transition into the live overview panel for your running application.

![Actions screen](/images/actions-screen.png)

When the overview appears, you’ll notice the port number displayed prominently, simply click this link to open your application in a browser. Alongside the port you’ll see real-time resource indicators (CPU usage, memory, etc.) and three control buttons: one to return to the installation log, another to stop the app, and a third to reload the interface.

![Started script](/images/started-script.png)

At any point you can toggle back to the installation log view by clicking the return button, even if your app is running. Dione may report non-critical warnings or errors in the log, but these will not interrupt your application’s execution.

![Information box](/images/info-screen-on-app.png)

Should you wish to end the session, use the stop button in either the overview panel or the log view. If Dione cannot terminate the process automatically, it will notify you to halt the application manually.

![Stop app](/images/stop-app.png)

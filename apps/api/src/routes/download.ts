import { Hono } from "hono";
import { downloadLatestVersion } from "../services/download";

const app = new Hono();

app.get("/", async (c) => {
    const osParam = c.req.query("os")?.toLowerCase() || "windows";
    const osMap: Record<string, "windows" | "mac" | "linuxAppImage"> = {
        windows: "windows",
        win: "windows",
        mac: "mac",
        macos: "mac",
        linux: "linuxAppImage",
    };

    const os = osMap[osParam];
    if (!os) {
        return c.text("Invalid os param. Use ?os=windows|mac|linux", 400);
    }

    try {
        const { stream, fileName } = await downloadLatestVersion(c, os);

        return new Response(stream as any, {
            status: 200,
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err: any) {
        return c.text(err?.message ?? "Download error", 502);
    }
});

export default app;

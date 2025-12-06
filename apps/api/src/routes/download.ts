import { Hono } from "hono";
import { downloadLatestVersion } from "../services/download";
import { initializeSupabase } from "../utils/database";

const app = new Hono();

app.get("/", async (c) => {
	const osParam = c.req.query("os")?.toLowerCase() || "windows";
	const osMap: Record<
		string,
		"windows" | "mac" | "linuxAppImage" | "linuxDeb" | "linuxRpm"
	> = {
		windows: "windows",
		win: "windows",
		mac: "mac",
		macos: "mac",
		linux: "linuxAppImage",
		linuxdeb: "linuxDeb",
		linuxrpm: "linuxRpm",
	};

	const os = osMap[osParam];
	if (!os) {
		return c.text(
			"Invalid os param. Use ?os=windows|mac|linux|linuxdeb|linuxrpm",
			400,
		);
	}

	try {
		const { stream, fileName } = await downloadLatestVersion(c, os);

		await trackDownload(c, os);

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

async function trackDownload(
	c: any,
	os: "windows" | "mac" | "linuxAppImage" | "linuxDeb" | "linuxRpm",
) {
	const supabase = initializeSupabase(c);

	const osIdMap: Record<string, string> = {
		windows: "windows",
		mac: "mac",
		linuxAppImage: "linux-appimage",
		linuxDeb: "linux-deb",
		linuxRpm: "linux-rpm",
	};

	const rowId = osIdMap[os];

	const { data: currentData, error } = await supabase
		.from("downloads")
		.select("count")
		.eq("id", rowId)
		.single();

	if (error) {
		console.error("Failed to get download count:", error);
		return;
	}

	if (!currentData) return;

	await supabase
		.from("downloads")
		.update({ count: currentData.count + 1 })
		.eq("id", rowId);
}

export default app;

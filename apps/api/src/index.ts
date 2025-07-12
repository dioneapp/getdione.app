import { Hono } from "hono";
import scriptsRouter from "./routes/scripts";

type Bindings = {
	SUPABASE_URL: string;
	SUPABASE_ANON_KEY: string;
	PRIVATE_KEY: string;
	RATE_LIMITER: any;
};

const app = new Hono<{ Bindings: Bindings }>();

// rate limit
app.use(async (c, next) => {
	const auth = c.req.header("Authorization");

	// if auth, skip rate limit
	if (auth === "Bearer " + c.env.PRIVATE_KEY) {
		return await next();
	}

	// if no auth, apply rate limit
	const ip = c.req.header("cf-connecting-ip") ?? "unknown";
	const path = c.req.path;
	const key = `${ip}:${path}`;

	const result = await c.env.RATE_LIMITER.limit({ key });

	if (!result.success) {
		return c.text(`429 Too many requests`, 429);
	}

	await next();
});

// v1
const v1 = new Hono<{ Bindings: Bindings }>();
// routes
v1.route("/scripts", scriptsRouter);

// mount v1
app.route("/v1", v1);

// general routes
app.get("/", async (c) => {
	return c.redirect("https://getdione.app/docs");
});

app.get("/status", async (c) => {
	const startAt = Date.now();
	const res = await fetch("https://getdione.app");
	const dummy = await res.ok;
	const endAt = Date.now();
	const latency = endAt - startAt;
	return c.json({
		status: dummy ? "ok" : "error",
		latency: `${latency}ms`,
		timestamp: new Date().toISOString(),
	});
});

export default app;

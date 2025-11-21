import { Hono } from "hono";
import models from "../files/ai/models.json";

const aiRouter = new Hono();

aiRouter.get("/models", async (c) => {
	return c.json({
		models: models,
	});
});

export default aiRouter;

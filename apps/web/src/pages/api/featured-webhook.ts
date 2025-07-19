import type { NextApiRequest, NextApiResponse } from "next";
import { sendFeaturedWebhook } from "@/app/server/webhook";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await sendFeaturedWebhook(req.body);
    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: "Failed to submit webhook" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

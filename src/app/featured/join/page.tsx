"use client";

import { sendFeaturedWebhook } from "@/app/server/webhook";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FeaturedJoin from "@/components/featured/FeaturedJoin";

// form submission handler
async function submitForm(formData: FormData) {
	const trapField = formData.get("trap_field")?.toString() || "";
	if (trapField !== "") {
		throw new Error("Form submission rejected.");
	}

	const name = formData.get("name")?.toString() || "";
	const email = formData.get("email")?.toString() || "";
	const toolName = formData.get("tool_name")?.toString() || "";
	const github = formData.get("github")?.toString() || "";
	const website = formData.get("website")?.toString() || "";
	const social = formData.get("social")?.toString() || "";
	const contactEmail = formData.get("contact_email")?.toString() || "";
	const objective = formData.get("objective")?.toString() || "";
	const category = formData.get("category")?.toString() || "";
	const audience = formData.get("audience")?.toString() || "";
	const metrics = formData.get("metrics")?.toString() || "";
	const tags = formData.get("tags")?.toString() || "";
	const testimonials = formData.get("testimonials")?.toString() || "";
	const reason = formData.get("reason")?.toString() || "";
	const financialInterest =
		formData.get("financial_interest")?.toString() || "no";
	const updates = formData.get("updates")?.toString() || "no";

	if (
		!name ||
		!email ||
		!toolName ||
		!github ||
		!objective ||
		!category ||
		!audience ||
		!metrics
	) {
		throw new Error("Required fields are missing");
	}

	const webhookBody = {
		embeds: [
			{
				title: "New Featured Tool Submission",
				color: 0xbcb1e7,
				fields: [
					{ name: "Submitter Name", value: name, inline: true },
					{ name: "Submitter Email", value: email, inline: true },
					{ name: "Tool Name", value: toolName, inline: true },
					{ name: "GitHub URL", value: github, inline: true },
					{ name: "Website", value: website || "N/A", inline: true },
					{ name: "Contact Email", value: contactEmail || "N/A", inline: true },
					{ name: "Social Media", value: social || "N/A", inline: true },
					{ name: "Category", value: category, inline: true },
					{ name: "Target Audience", value: audience, inline: true },
					{ name: "Monthly Metrics", value: metrics, inline: true },
					{ name: "Tool Objective", value: objective },
					{ name: "Tags", value: tags || "N/A", inline: true },
					{
						name: "Financial Interest",
						value: financialInterest === "yes" ? "Yes" : "No",
						inline: true,
					},
					{
						name: "Newsletter",
						value: updates === "yes" ? "Subscribed" : "Not subscribed",
						inline: true,
					},
					{ name: "Testimonials", value: testimonials || "N/A" },
					{ name: "Why Feature This Tool", value: reason || "N/A" },
				],
				timestamp: new Date().toISOString(),
			},
		],
	};

	const result = await sendFeaturedWebhook(webhookBody);
	if (!result.success) {
		throw new Error("Failed to submit application");
	}
}

export default function FeaturedJoinPage() {
	const router = useRouter();
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");

		try {
			const formData = new FormData(e.currentTarget);
			await submitForm(formData);
			router.push("/featured/success");
		} catch (e) {
			console.error("Form submission error:", e);
			setError("There was an error submitting your request. Please try again.");
		}
	}

	return <FeaturedJoin error={error} handleSubmit={handleSubmit} />;
}
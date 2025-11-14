import { redirect } from "next/navigation";

export const runtime = "edge";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ShareRedirectPage({ params }: PageProps) {
	const { id } = await params;

	if (!id) {
		redirect("/");
	}

	try {
		const response = await fetch(
			`https://api.getdione.app/v1/share/${id}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.PRIVATE_KEY}`,
				},
			},
		);

		if (!response.ok) {
			redirect("/");
		}

		const data = await response.json();

		if (!data.longUrl) {
			redirect("/");
		}

		redirect(data.longUrl);
	} catch (error) {
		console.error("Error fetching shared URL:", error);
		redirect("/");
	}
}

import { redirect } from "next/navigation";
import { getShareUrl } from "../actions";

export default async function ShareRedirectPage(props: any) {
  const { id } = (await props.params) as { id: string };

  if (!id) redirect("/");

  try {
    const { url } = await getShareUrl(id);
    redirect(url);
  } catch (error) {
    console.error(error);
    redirect("/");
  }
}

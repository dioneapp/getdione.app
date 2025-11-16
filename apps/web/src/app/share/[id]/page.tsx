import { redirect } from "next/navigation";
import { getShareUrl } from "../actions";

export default async function ShareRedirectPage(props: any) {
  const { id } = (await props.params) as { id: string };

  if (!id) {
    redirect("/");
  }

  const result = await getShareUrl(id);

  if (!result || !result.url) {
    redirect("/");
  }

  redirect(result.url);
}

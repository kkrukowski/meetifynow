import VerifyEmail from "@/routes/auth/VerifyEmail.tsx";
import { auth } from "@src/auth.ts";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session?.user) return redirect("/profile");

  return <VerifyEmail />;
}

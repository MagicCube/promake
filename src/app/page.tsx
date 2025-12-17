import { redirect } from "next/navigation";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { getSession } from "@/server/better-auth/server";

export default async function Home() {
  const res = await getSession();
  if (res?.user) {
    redirect("./workspace");
    return;
  }

  return (
    <div>
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}

import { type Metadata } from "next";

import { Header } from "@/components/landing/header";
import Background from "@/components/react-bits/dark-veil";

import { appMetadata } from "../../app-metadata";

import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: `Sign in - ${appMetadata.title}`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function SignInPage() {
  return (
    <div className="relative flex h-screen w-screen">
      <Header />
      <Background speed={2} />
      <div className="pointer-events-none absolute right-0 left-0 flex size-full items-center justify-center">
        <SignInForm />
      </div>
    </div>
  );
}

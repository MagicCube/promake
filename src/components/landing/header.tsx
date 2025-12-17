"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { appMetadata } from "@/app-metadata";

import { Button } from "../ui/button";

export function Header() {
  const pathname = usePathname();
  return (
    <div className="fixed top-8 left-0 z-50 h-15 w-full">
      <div className="mx-auto flex h-full w-[90%] items-center justify-between rounded-[50px] border border-white/10 bg-white/5 px-6 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] md:w-[60%]">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={20} height={20} />
          <div className="text-xl">{appMetadata.title}</div>
        </Link>

        <div className="hidden items-center text-sm font-semibold text-white md:flex">
          {pathname !== "/" && (
            <Button
              variant="ghost"
              className="text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/">Home</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/" target="_blank">
              Documents
            </Link>
          </Button>
          {pathname !== "/sign-in" && (
            <Button
              variant="ghost"
              className="text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

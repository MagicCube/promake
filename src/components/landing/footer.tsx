import Link from "next/link";

import { appMetadata } from "@/app-metadata";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} {appMetadata.title} Inc. All rights
          reserved.
        </p>
        <div className="flex gap-6">
          <Link
            href="#"
            className="text-sm font-medium text-gray-400 hover:text-white hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-400 hover:text-white hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-400 hover:text-white hover:underline"
          >
            Twitter/X
          </Link>
        </div>
      </div>
    </footer>
  );
}

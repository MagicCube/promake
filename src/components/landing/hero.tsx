"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import Background from "@/components/react-bits/dark-veil";
import { Button } from "@/components/ui/button";

import { HyperText } from "../ui/hyper-text";

export function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0 size-full">
        <Background speed={1.6} hueShift={66} noiseIntensity={0.1} />
      </div>
      <div className="relative z-10 container flex flex-col items-center px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-white">
                <HyperText animateOnHover={false} duration={1200}>
                  THE ALL-IN-ONE
                </HyperText>
              </span>
              <span className="text-primary mt-2 block">
                <HyperText animateOnHover={false} duration={2000}>
                  PRO-GRADE AIGC STUDIO
                </HyperText>
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl"
          >
            Promake turns simple prompts into professional visuals through a
            single, intelligent workflow. From words to art, instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
              asChild
            >
              <Link href="/sign-in">Start Making</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Background Gradient for fade out bottom */}
      <div className="from-background absolute inset-x-0 bottom-0 h-40 bg-linear-to-t to-transparent" />
    </section>
  );
}

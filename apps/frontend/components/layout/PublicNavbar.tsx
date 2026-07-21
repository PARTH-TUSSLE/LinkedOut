"use client";

import Link from "next/link";
import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { motion } from "framer-motion";

export function PublicNavbar() {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-bg/80 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-body-sm font-semibold text-text-primary"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-text">
            <Linkedin size={15} />
          </div>
          LinkedOut
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/signin">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

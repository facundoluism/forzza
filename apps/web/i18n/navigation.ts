// Re-export locale-aware navigation primitives from next-intl.
// Import Link, redirect, usePathname, useRouter from HERE (not "next/link" etc.)
// so they carry the active locale automatically.
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

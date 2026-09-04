"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Routes that run their own focused, distraction-free chrome. */
const HIDDEN_ON = ["/match"];

/** Hides the site-wide ticker/footer on routes with their own minimal chrome. */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;
  return <>{children}</>;
}

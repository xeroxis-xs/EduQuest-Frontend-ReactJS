import type { Metadata } from "next";
import { config } from "@/config";
import * as React from "react";

// Ensure metadata conforms to Metadata type through regular type checking
export const metadata: Metadata = { title: `Quest Details | ${config.site.name}` };

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div>
      {children}
    </div>
  );
}

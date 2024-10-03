import * as React from 'react';
import type { Metadata } from "next";
import { config } from "@/config";

export const metadata: Metadata = { title: `My Badges | Badge | ${config.site.name}` };

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div>
      {children}
    </div>
  );
}

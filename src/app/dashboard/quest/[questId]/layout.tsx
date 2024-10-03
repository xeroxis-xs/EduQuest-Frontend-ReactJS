import type { Metadata } from "next";
import { config } from "@/config";
import * as React from "react";

// Ensure metadata conforms to Metadata type through regular type checking
export async function generateMetadata({params} : { params: {questId: string } }): Promise<Metadata> {
  return {
    title: `Quest ${params.questId} Details | ${config.site.name}`
  }
}
export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div>
      {children}
    </div>
  );
}

import * as React from 'react';
import type { Metadata } from "next";
import { config } from "@/config";

export async function generateMetadata({params} : { params: {courseGroupId: string } }): Promise<Metadata> {
  return {
    title: `Import Quest to Group ${params.courseGroupId} | ${config.site.name}`
  }
}

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div>
      {children}
    </div>
  );
}

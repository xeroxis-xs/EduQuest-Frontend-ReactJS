import * as React from 'react';
import type { Metadata } from "next";
import { config } from "@/config";

export async function generateMetadata({params} : { params: {courseId: string } }): Promise<Metadata> {
  return {
    title: `Course ${params.courseId} Details | Course | ${config.site.name}`
  }
}

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div>
      {children}
    </div>
  );
}

import type { Metadata } from "next";
import Page from "./page";   // import your Demo's page
import { config } from "@/config";

// Ensure metadata conforms to Metadata type through regular type checking
export const metadata: Metadata = { title: `Course Details | ${config.site.name}` };

export default Page;

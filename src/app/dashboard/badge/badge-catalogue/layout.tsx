import type { Metadata } from "next";
import Page from "./page";
import { config } from "@/config";

// Ensure metadata conforms to Metadata type through regular type checking
export const metadata: Metadata = { title: `Badge Catalogue | ${config.site.name}` };

export default Page;

import { Metadata } from "next";
import Page from "./page";   // import your Demo's page
import { config } from "@/config";

export const metadata = { title: `Eduquest Users | Dashboard | ${config.site.name}` } satisfies Metadata;

export default Page;

import type { Metadata } from "next";
import { Storefront } from "@/components/widget/storefront";

export const metadata: Metadata = {
  title: "Northwind Store — Live widget demo",
  description:
    "A demo business website showing the embeddable SupportBrain chat widget in action.",
};

export default function DemoStorePage() {
  return <Storefront />;
}

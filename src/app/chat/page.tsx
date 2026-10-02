import type { Metadata } from "next";
import { CustomerChat } from "@/components/chat/customer-chat";

export const metadata: Metadata = {
  title: "Customer Chat",
  description: "Customer-facing AI support chat powered by business knowledge.",
};

export default function ChatPage() {
  return <CustomerChat />;
}

import { ConsoleShell } from "@/components/layout/console-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConsoleShell variant="admin">{children}</ConsoleShell>;
}

import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicLayoutClient } from "@/components/layout/PublicLayoutClient";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <PublicNavbar />
      <main>
        <PublicLayoutClient>{children}</PublicLayoutClient>
      </main>
    </div>
  );
}

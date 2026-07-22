import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicLayoutClient } from "@/components/layout/PublicLayoutClient";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <PublicNavbar />
      <main>
        <PublicLayoutClient>{children}</PublicLayoutClient>
      </main>
    </div>
  );
}

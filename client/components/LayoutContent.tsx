// app/LayoutContent.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isManagementRoute = pathname?.startsWith('/management');

  return (
    <>
      {!isManagementRoute && <Header />}
      <main className={isManagementRoute ? "" : "pt-15"}>
        {children}
      </main>
      {!isManagementRoute && <Footer />}
    </>
  );
}
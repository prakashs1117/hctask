"use client";

import { Sidebar } from "@/components/organisms/sidebar";
import { Header } from "@/components/organisms/header";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout with sidebar and header
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
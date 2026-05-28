import type { Metadata } from "next";

import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primary Market Workflow",
  description: "Local MVP for VC/PE/FA primary market workflow automation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="min-w-0 flex-1">
            <div className="w-full px-6 py-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}

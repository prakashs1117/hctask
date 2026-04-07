import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { AuthGuard } from "@/components/providers/auth-guard";
import { FeatureFlagsProvider } from "@/lib/contexts/feature-flags-context";
import { Sidebar } from "@/components/organisms/sidebar";
import { Header } from "@/components/organisms/header";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"], // Only light to semibold weights
  style: ["normal"],
  display: "swap",
  preload: true,
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "Pharma RCD - Portfolio Dashboard",
  description: "Drug Development Portfolio Management System",
};

/**
 * Root layout component
 * Wraps all pages with providers and global layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${poppins.className}`}>
        <FeatureFlagsProvider userId="current-user" environment="production">
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <QueryProvider>
                <I18nProvider>
                  <AuthGuard>
                    {children}
                  </AuthGuard>
                </I18nProvider>
              </QueryProvider>
              <Toaster />
            </ThemeProvider>
          </ReduxProvider>
        </FeatureFlagsProvider>
      </body>
    </html>
  );
}

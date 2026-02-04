import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import ConnectionStatus from "@/components/ConnectionStatus";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Interview Preparation Platform",
    template: "%s | Interview Platform"
  },
  description: "Prepare for your next tech interview with curated questions and answers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <AuthProvider>
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            <ConnectionStatus />
            <AppLayout>{children}</AppLayout>
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./killchain.css";
import "./l2investigation.css";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import TopNav from "@/components/TopNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "SOAx - SOC Operations Assistant",
  description: "Advanced Security Operations Center management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <AuthProvider>
            <DataProvider>
              <div style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>
                <TopNav />
                <main className="main-content-top-nav">
                  {children}
                </main>
              </div>
            </DataProvider>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}

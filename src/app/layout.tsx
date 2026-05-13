import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppNavigation } from "@/components/AppNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "顧客課題PDF作成",
  description: "パーソナルトレーナー向けの顧客課題PDF作成Webアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen bg-slate-50">
          <AppNavigation />
          <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

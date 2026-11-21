import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multichain dApps — Sepolia и viem",
  description: "Лабораторная работа: кошелёк, тестовая транзакция и чтение контрактов в Sepolia",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

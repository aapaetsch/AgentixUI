import type { Metadata } from "next";
import "aapaetsch-ui-kit/globals.css";

export const metadata: Metadata = {
  title: "AgentixUI packed artifact fixture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

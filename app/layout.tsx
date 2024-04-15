import Layout from "./components/Layout";
import "./globals.css";
import Providers from "./Providers";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investrio | Personalized Financial Planning & Advisory",
  description: "Eliminate your debt & build your future. Investrio provides a personal approach to your finances and beyond. Helping you move financially forward.",
  openGraph: {
    title: "Investrio | Personalized Financial Planning & Advisory",
    description: "Eliminate your debt & build your future. Investrio provides a personal approach to your finances and beyond. Helping you move financially forward.",
    images: [
      {
        url: `${process.env.NEXTAUTH_URL}/logo.png`,
        width: 800,
        height: 600,
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
        />
      </Head>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}

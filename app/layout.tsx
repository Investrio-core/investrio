import Layout from "./components/Layout";
import "./globals.css";
import Providers from "./Providers";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investrio | Personalized Financial Planning & Advisory",
  description:
    "Eliminate your debt & build your future. Investrio provides a personal approach to your finances and beyond. Helping you move financially forward.",
  openGraph: {
    title: "Investrio | Personalized Financial Planning & Advisory",
    description:
      "Eliminate your debt & build your future. Investrio provides a personal approach to your finances and beyond. Helping you move financially forward.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={"anonymous"}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
        />

        {/* <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        /> */}
      </Head>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}

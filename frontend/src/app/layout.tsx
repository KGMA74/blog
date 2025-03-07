'use client'; 
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Link from "next/link";
import RequireAuth from "../components/utils/RequireAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import  TagFilter from "../components/TagFilter";
import Provider from "../redux/provider";
import Setup from "../components/utils/Setup";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isAuthPage = pathname === "/auth/login-register";

  return (
    <Provider>
      <html lang="en">
        <body
          className={``}
        >
          {/* <RequireAuth> */}
          
          <Setup />
          {/* <ScreenIndicator /> */}

          {/* Header */}
          {!isAuthPage && <Header />}



                  {children}

          {/* Footer */}
          {/* {!isAuthPage && <Footer />} */}
          {/* </RequireAuth> */}
        </body>
      </html>
    </Provider>
  );
}

"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function Analytics() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-TNE2QEWP71", {
        page_path: window.location.pathname,
      });
    }
  }, []);

  return (
    <>
      {/* Load gtag.js from GA */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-TNE2QEWP71"
        strategy="afterInteractive"
      />
      {/* Init GA config */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
        `}
      </Script>
    </>
  );
}

"use client"
import React from 'react';
import Link from 'next/link';
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

export default function Home() {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {showSplash ? (
        <div className="fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out" style={{ opacity: showSplash ? 1 : 0 }}>
          <img src="/images/splashscreen.gif" alt="Splash Screen" className="max-w-full max-h-full" />
        </div>
      ) : (
        <iframe className="w-screen h-screen" src='https://hlcardew.wixsite.com/what-are-the-odz' />
      )}
    </div>
  );
}

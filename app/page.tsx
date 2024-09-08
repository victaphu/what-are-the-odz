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
        <main className="container mx-auto px-4 py-12">
          <AuthProvider>
            <div className="space-y-8 max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-center">Welcome to Odz: Interactive Event Engagement Platform</h1>
              
              <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-semibold mb-4">What is Odz?</h2>
                <p className="text-gray-700">
                  Odz is an innovative web application designed to enhance event experiences by allowing participants to create groups, set up events, and place bets on event-related questions using virtual Odz Coins. Our platform combines secure messaging, dynamic betting systems, and blockchain technology to create an engaging and interactive environment for all types of events.
                </p>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Event Creation: Organizers can create private groups for their events.</li>
                  <li>Prediction Setup: Set various outcomes for guests to predict.</li>
                  <li>Virtual Currency: Users receive Odz Coins for placing bets.</li>
                  <li>Real-time Odds: Dynamic updating of odds as bets are placed.</li>
                  <li>Consensus-based Verification: Ensures fair result determination.</li>
                  <li>Leaderboard: Showcases top predictors.</li>
                  <li>Smart Contracts: Ensures transparency and security.</li>
                </ul>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-semibold mb-4">Why Join Odz?</h2>
                <p className="text-gray-700">
                  Join Odz to revolutionize your event experience! Whether you're an event organizer or a participant, Odz offers a unique blend of engagement, excitement, and technology. Make predictions, earn Odz Coins, and climb the leaderboard while enjoying secure and transparent interactions powered by blockchain technology.
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <Link href="/connect" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Launch App
                </Link>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                  Learn More
                </button>
              </div>
            </div>
          </AuthProvider>
        </main>
      )}
    </div>
  );
}

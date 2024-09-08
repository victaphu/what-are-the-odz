"use client"
import { Chat } from "@/app/components/Chat/Chat";
import { AuthProvider } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import CreateGroupDialog from "../components/Chat/Dialog/CreateGroupDialog";
import { GroupsProvider } from "../context/GroupsContext";
import { EventProvider } from "../context/EventsContext";
import CreateEventDialog from "../components/Chat/Dialog/CreateEventDialog";
import EventsDialog from "../components/Events/EventDialog";
import { WalletProvider } from "../context/WalletContext";
import { LeaderBoardContext } from "../context/LeaderboardContext";
import LeaderboardComponent from "../components/Leaderboard/leaderboardDialog";
import React from "react";

export default function Home() {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {showSplash && (
        <div style={{
          zIndex: 20,
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 1s ease-in-out',
          opacity: showSplash ? 1 : 0,
          backgroundColor: 'rgb(64, 71, 87)',
        }}>
          <img src="/images/splashscreen.gif" alt="Splash Screen" style={{
            maxWidth: '100%',
            maxHeight: '100%'
          }} />
        </div>
      )}
      <div className="root">
        <main className="app">
          <AuthProvider>
            <GroupsProvider>
              <ChatProvider>
                <EventProvider>
                  <WalletProvider>
                    <LeaderBoardContext>
                      <Chat />
                      <CreateGroupDialog />
                      <CreateEventDialog />
                      <EventsDialog />
                      <LeaderboardComponent />
                    </LeaderBoardContext>
                  </WalletProvider>
                </EventProvider>
              </ChatProvider>
            </GroupsProvider>
          </AuthProvider>
        </main>
      </div>
    </div>)
}
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

export default function Home() {
  return (
    <div className="root">
      <main className="app">
        <AuthProvider>
          <GroupsProvider>
            <ChatProvider>
              <EventProvider>
                <WalletProvider>
                  <Chat />
                  <CreateGroupDialog />
                  <CreateEventDialog />
                  <EventsDialog />
                </WalletProvider>
              </EventProvider>
            </ChatProvider>
          </GroupsProvider>
        </AuthProvider>
      </main>
    </div>
  );

}
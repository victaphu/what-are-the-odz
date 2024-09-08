"use client"
import { Connect } from "../components/Connect/Connect";
import { AuthProvider } from "../context/AuthContext";
import { XMTPProvider } from "../context/blockchain/xmtpClient";

export default function ConnectPage() {
  return <div className="root">
    <main className="app">
      <XMTPProvider>
        <AuthProvider>
          <Connect />
        </AuthProvider>
      </XMTPProvider>
    </main>
  </div>
}
"use client"
import { Connect } from "../components/Connect/Connect";
import { AuthProvider } from "../context/AuthContext";

export default function ConnectPage() {
  return <div className="root">
    <main className="app">
      <AuthProvider>
        <Connect />
      </AuthProvider>
    </main>
  </div>
}
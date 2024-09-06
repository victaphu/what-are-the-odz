"use client";
import { useState, useEffect } from "react";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { GoogleOutlined, WalletOutlined, CommentOutlined } from "@ant-design/icons";
import "@/app/styles/index.scss";
import { Alert } from "antd";
import "@/app/globals.css";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export const Connect = () => {
    const { user, provider, login, logout } = useAuth()

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const connectWallet = async () => {
        setLoading(true);
        try {
            await login();
        } catch (error) {
            console.error(error);
            setError("Failed to connect wallet");
        }
        setLoading(false);
    };

    if (user) {
        router.push('/home');
    }

    return (
        <div className="auth-form w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="logo flex items-center justify-center mb-6">
                <CommentOutlined className="text-4xl text-blue-500 mr-3" />
                <div className="logo-text flex flex-col">
                    <div className="logo-text-first text-2xl font-bold text-white">What Are the</div>
                    <div className="logo-text-second text-3xl font-extrabold text-blue-500">Odz?</div>
                </div>
            </div>

            <div className="game-description text-md text-gray-300 mt-4 mb-8 text-center">
                <p>Welcome to Odz - the social prediction game that turns any event into an unforgettable, interactive experience!</p>
            </div>
            {!loading ? (
                <div className="login-buttons flex flex-col w-full mx-auto">

                    {error && (
                        <Alert
                            message="Error"
                            description={error}
                            type="warning"
                            showIcon
                            className="mb-4"
                        />
                    )}

                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full mb-6 transition duration-300 ease-in-out flex items-center justify-center" onClick={connectWallet}>
                        <GoogleOutlined className="mr-2" /> Connect with Social
                    </button>
                    <div className="terms-privacy text-sm text-gray-400 flex justify-center w-full mx-auto">
                        <a href="/terms" className="hover:text-blue-400 transition-colors duration-300 flex items-center mr-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Terms & Conditions
                        </a>
                        <a href="/privacy" className="hover:text-blue-400 transition-colors duration-300 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Privacy Policy
                        </a>
                    </div>
                </div>
            ) : (
                <div className="loading-image flex justify-center items-center h-full">
                    <img src={'images/loading.svg'} alt="Loading" className="w-16 h-16" />
                </div>
            )}
        </div>
    );
};

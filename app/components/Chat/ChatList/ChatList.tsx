"use client"
import React, { useEffect, useState } from 'react'
import { ChatProfile } from "./ChatProfile";
import NewChatForm from './NewChatForm'
import { CloseOutlined, BgColorsOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Group, useGroups } from '@/app/context/GroupsContext';
import { Spin } from 'antd';


const ChatList = (props: { chatAppState: { userName: any; renderChatCard: (arg0: any, arg1: any) => string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; offset: number; renderNewChatForm: (arg0: any) => string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; onClose: () => any; }; }) => {
    const [hasMoreChats, setHasMoreChats] = useState(true)
    const [logoSource, setLogoSource] = useState('/images/chatlogo.png');
    const [theme, setTheme] = useState("dark");
    const [showProfile, setShowProfile] = useState(false);
    const { logout } = useAuth();
    const { groups, loading } = useGroups();
    const router = useRouter();

    useEffect(() => {

        const themeValue = localStorage.getItem("theme");

        if (themeValue === "light") {
            document.querySelector(".app")?.classList.add("light");
            setLogoSource('/images/chatlogowhite.png')

        } else if (themeValue === "dark") {
            document.querySelector(".app")?.classList.remove("light");
            setLogoSource('/images/chatlogo.png')

        } else {
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    function renderGroups(groups: Group[]) {
        if (loading) {
            return (
                <div style={{ color: 'var(--active-title)', textAlign: 'center', padding: '20px' }}>
                    <Spin />
                    <p>Loading groups...</p>
                </div>
            );
        }

        if (groups.length === 0) {
            return (
                <div style={{ color: 'var(--active-title)', textAlign: 'center', padding: '20px' }}>
                    <p>No groups available</p>
                    <button
                        onClick={() => {/* Add logic to create a new group */ }}
                        style={{
                            backgroundColor: 'var(--active-title)',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Add a Group
                    </button>
                </div>
            );
        }

        return groups.map((group, index) => {
            if (!group) {
                return <div key={`chat_${index}`} />
            } else if (props.chatAppState.renderChatCard) {
                return <div key={`chat_${index}`}>{props.chatAppState.renderChatCard(group, index)}</div>
            } else {
                return null;
            }
        })
    }

    if (groups == null) return <div />;
    return (
        <div className="chat-left-wing">
            <div className="chat-bar">
                <div className="chat-bar-logo">
                    <img src={logoSource} alt="Chat Logo" />
                    <div className="mobile-toggler">
                        <CloseOutlined
                            onClick={() => {
                                const container = document.querySelector(".chat-container");
                                if (container instanceof HTMLElement) {
                                    const firstChild = container.children[0].children[1].children[0];
                                    const secondChild = container.children[0].children[1].children[1];
                                    if (firstChild instanceof HTMLElement) {
                                        firstChild.style.display = "none";
                                    }
                                    if (secondChild instanceof HTMLElement) {
                                        secondChild.style.display = "block";
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="chat-bar-options">
                    <div className="chat-bar-option">
                        <UserOutlined
                            onClick={() => setShowProfile(true)}
                        />
                    </div>
                    <div className="chat-bar-option">
                        <BgColorsOutlined onClick={() => {
                            const themeValue = localStorage.getItem("theme");
                            if (themeValue === "dark") {
                                setTheme("light")
                                localStorage.setItem("theme", "light");
                                document.querySelector(".app")?.classList.add("light");
                                setLogoSource('/images/chatlogowhite.png')
                            } else if (themeValue === "light") {
                                setTheme("dark")
                                localStorage.setItem("theme", "dark");
                                document.querySelector(".app")?.classList.remove("light");
                                setLogoSource('/images/chatlogo.png')
                            }
                        }} />
                    </div>
                    <div className="chat-bar-option"> <LogoutOutlined onClick={() => {
                        if (window.confirm("Press OK if you want to logout")) {
                            // fb.auth.signOut().then(console.log("logged out"))
                            document.querySelector(".app")?.classList.remove("light");
                            logout();
                            router.push("/connect")

                        }
                    }} /></div>
                </div>
            </div>
            <div className="chat-left-wing-list">
                {showProfile ? (
                    <ChatProfile closeProfile={() => setShowProfile(false)} />
                ) : (
                    <div style={styles.chatListContainer} className='ce-chat-list overflow-hidden'>
                        {
                            props.chatAppState.renderNewChatForm ?
                                props.chatAppState.renderNewChatForm('') :
                                <NewChatForm />
                        }
                        <div style={styles.chatsContainer} className='ce-chats-container'>
                            {renderGroups(groups)}
                            {
                                hasMoreChats && groups.length > 0 &&
                                <div>
                                    <div style={{ height: '8px' }} />
                                </div>
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    chatListContainer: {
        maxHeight: '100vh',
        overflow: 'scroll',
        // overflowX: 'hidden',
        backgroundColor: 'white',
        fontFamily: 'Avenir'
    },
    chatsContainer: {
        width: '100%',
        borderRadius: '0px 0px 24px 24px'

    },
}

export default ChatList;
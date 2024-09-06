import { useAuth } from "@/app/context/AuthContext";
import { Group, useGroups } from "@/app/context/GroupsContext";
import React from "react";
// import empty from "../../../images/empty.png";

export const ChatCard = (props: { group: Group; index: number }) => {
    // const { conn, activeChat, setActiveChat } = useContext(ChatEngineContext);
    const { group } = props;
    // const { activeChat, setActiveChat } = useChat();
    const { activeGroup, setActiveGroup, groups } = useGroups();
    const { user } = useAuth();

    const capitalize = (str: string, lower = true) => {
        return (lower ? str.toLowerCase() : str).replace(
            /(?:^|\s|["'([{])+\S/g,
            (match) => match.toUpperCase()
        );
    };
    // if (!conn || conn === null) return <div />;
    if (!group) return <div />;

    const extraStyle = activeGroup === group.id ? styles.activeChat : {};
    // const otherPerson = group.people.find(
    //     (person: { person: { username: string | undefined; }; }) => person.person.username !== user?.name
    // );
    // const convertedUsername = otherPerson ? otherPerson.person.username : "";
    const title = capitalize(decodeURIComponent(group.name));

    let lastMessage = group.description;

    const isToday = (someDate: Date) => {
        const today = new Date()
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
    }
    function getDateTime(date: string) {
        // if (!date) return ''
        date = date.replace(' ', 'T')
        const year = date.substring(0, 4)
        const month = date.substring(5, 2)
        const day = date.substring(8, 2)
        const hour = date.substring(11, 2)
        const minute = date.substring(14, 2)
        const second = date.substring(17, 2)
        var d = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
        let offset = (-(d.getTimezoneOffset()) / 60)
        d.setHours(d.getHours() + offset)
        return d
    }
    function timeSinceDate(date: string) {
        if (!date) return ''
        let convertedDate = getDateTime(date)
        let sent = convertedDate.toString()
        const dayStr = sent.substring(3, 7)
        const timeStr = sent.substring(15, 6)
        if (isToday(convertedDate)) {
            return timeStr
        } else {
            return dayStr
        }
    }

    return (
        <div
            onClick={() => setActiveGroup(group.id)}
            style={{ ...styles.chatContainer, ...extraStyle }}
            className={`ce-chat-card ${activeGroup === group.id && "ce-active-chat-card"}`}
        >
            {group.emoji ? (
                <div className="avatar-online">
                    <div
                        className="chat-card-avatar"
                        style={{
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "24px",
                            backgroundColor: "#f0f0f0"
                        }}
                    >
                        {group.emoji}
                    </div>
                </div>
            ) : (
                <div className="avatar-online">
                    <img
                        src={'/images/empty.png'}
                        className="chat-card-avatar"
                        style={{ borderRadius: "50%", width: "40px" }}
                        alt=""
                    />

                </div>

            )}

            <div className="chat-card-info">
                <div
                    style={styles.titleText}
                    className="ce-chat-title-text"
                    id={`ce-chat-card-title-${title}`}
                >
                    {title}
                </div>

                <div style={{ width: "100%" }} className="ce-chat-subtitle">
                    <div
                        style={styles.messageText}
                        className="ce-chat-subtitle-text ce-chat-subtitle-message"
                    >
                        {group.description}
                    </div>


                </div>
            </div>
        </div>
    );
};

const styles = {
    chatContainer: {
        padding: "16px",
        paddingBottom: "12px",
        cursor: "pointer",
    },
    titleText: {
        fontWeight: "500",
        paddingBottom: "4px",
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    status: {
        width: '10px',
        height: '10px',
        borderRadius: '100%',
        border: '2px solid #d3d8e4de',
        // position: 'absolute',
        top: '35px'
    },
    messageText: {
        width: "100%",
        color: "var(--gray-text)",
        fontSize: "13px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        display: "inline-block",
    },
    activeChat: {
        backgroundColor: "#d9d9d9",
        border: "4px solid white",
        borderRadius: "12px",
    },
};

export default ChatCard;

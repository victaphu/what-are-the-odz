import React from "react";
import { Row, Col } from "react-grid-system";
import { setConfiguration } from "react-grid-system";
import { MenuOutlined } from "@ant-design/icons";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "antd";
import { useEvents } from "@/app/context/EventsContext";
import { useGroups } from "@/app/context/GroupsContext";

setConfiguration({ maxScreenClass: "xl", gutterWidth: 0 });

export const ChatHeader = () => {
    // const { conn, chats, activeChat } = useContext(ChatEngineContext);
    // const { chats, activeChat } = useChat();
    const { groups, activeGroup } = useGroups();
    const { user } = useAuth();
    const { showCreateEventDlg, setShowCreateEventDlg } = useEvents();

    const capitalize = (str: string, lower = true) => {
        return (lower ? str.toLowerCase() : str).replace(
            /(?:^|\s|["'([{])+\S/g,
            (match) => match.toUpperCase()
        );
    };
    if (!groups || !groups.find(g => g.id === activeGroup)) {
        return <div className="mobile-toggler">
            <MenuOutlined
                onClick={() => {
                    const chatContainer = document.querySelector(".chat-container");
                    if (chatContainer) {
                        const firstChild = chatContainer.children[0];
                        if (firstChild) {
                            const secondChild = firstChild.children[1];
                            if (secondChild) {
                                const firstGrandchild = secondChild.children[0] as HTMLElement;
                                const secondGrandchild = secondChild.children[1] as HTMLElement;
                                if (firstGrandchild && secondGrandchild) {
                                    firstGrandchild.style.display = "block";
                                    secondGrandchild.style.display = "none";
                                }
                            }
                        }
                    }
                }}
            />
        </div>;
    }

    const group = groups.find(g => g.id === activeGroup)!;
    // const otherPerson = chat.people.find(
    //     (person) => person.person.username !== user?.name
    // );
    // const userStatus = (otherPerson) ? otherPerson.person.first_name : ""
    const title = group.name;

    function getDateTime(date: string) {
        if (!date) return ''
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

    function timeSinceDate(date: any) {
        // if (!date) return ''
        let convertedDate = getDateTime(date)
        let sent = convertedDate.toString()
        const dayStr = sent.substring(0, 10)
        const timeStr = sent.substring(15, 6)
        return `${dayStr} at ${timeStr}`
    }
    return (
        <Row className="ce-chat-title absolute" style={{ ...styles.titleSection, position: "absolute" }}>

            <div className="mobile-toggler">
                <MenuOutlined
                    onClick={() => {
                        const chatContainer = document.querySelector(".chat-container");
                        if (chatContainer) {
                            const firstChild = chatContainer.children[0];
                            if (firstChild) {
                                const secondChild = firstChild.children[1];
                                if (secondChild) {
                                    const firstGrandchild = secondChild.children[0] as HTMLElement;
                                    const secondGrandchild = secondChild.children[1] as HTMLElement;
                                    if (firstGrandchild && secondGrandchild) {
                                        firstGrandchild.style.display = "block";
                                        secondGrandchild.style.display = "none";
                                    }
                                }
                            }
                        }
                    }}
                />
            </div>

            <Col
                xs={24}
                sm={24}
                style={{ ...styles.titleContainer, 'textAlign': 'left', paddingRight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                className="ce-chat-title-container text-left"
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {group.emoji ? (
                        <div className="avatar-online">
                            {/* <div
                        className='ce-avatar-status absolute'
                        style={{
                            ...styles.status,
                            ...{ backgroundColor: '#52c41a' }
                        }}
                    /> */}
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
                            {/* <div
                        className='ce-avatar-status absolute'
                        style={{
                            ...styles.status,
                            ...{ backgroundColor: '#52c41a' }
                        }}
                    /> */}
                            <img
                                src={'/images/empty.png'}
                                className="chat-card-avatar"
                                style={{ borderRadius: "50%", width: "40px" }}
                                alt=""
                            />

                        </div>

                    )}
                    <div className="ce-chat-header-container" style={{ marginLeft: '10px' }}>
                        <div
                            style={styles.titleText}
                            className="ce-chat-title-text"
                            id={`ce-chat-feed-title-${title}`}
                        >
                            {title}
                        </div>

                        <div style={styles.subtitleText} className="ce-chat-subtitle-text">
                            {group.description}
                        </div>
                    </div>
                </div>
                <Button
                    type="primary"
                    className="ce-create-event-button"
                    onClick={() => setShowCreateEventDlg(true)}
                    style={{ marginRight: '20px' }}
                >
                    + Event
                </Button>
            </Col>
        </Row>
    );
};

export default ChatHeader;

const styles = {
    titleSection: {
        // position: "absolute",
        top: "0px",
        width: "99%",
        zIndex: "1",
        backgroundColor: "rgb(256, 256, 256, 0.92)",
        fontFamily: "Avenir",
    },
    mobileOptiom: {
        width: "100%",
        top: "32px",
        // textAlign: "center",
        color: "rgb(24, 144, 255)",
        overflow: "hidden",
    },
    titleContainer: {
        width: "100%",
        padding: "18px 0px",
        // textAlign: "left",
        color: "rgb(24, 144, 255)",
    },
    titleText: {
        fontSize: "24px",
        fontWeight: "600",
    },
    subtitleText: {
        fontSize: "12px",
    },
    status: {
        width: '12px',
        height: '12px',
        borderRadius: '100%',
        border: '2px solid #d3d8e4de',
        // position: 'absolute',
        top: '35px'
    },
};

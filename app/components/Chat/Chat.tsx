import React, { useState, useEffect } from "react";
import ChatCard from "./ChatList/ChatCard";
import ChatHeader from "./ChatFeed/ChatHeader";
import axios from "axios";
import NewChatForm from './ChatList/NewChatForm'
import NewMessageForm from './ChatFeed/NewMessageForm/NewMessageForm'
import ChatList from './ChatList/ChatList'
import { useAuth } from "@/app/context/AuthContext";
import "@/app/styles/index.scss";
import ChatMessages from "./ChatFeed/MessageFeed";
import EventsList from "../Events/EventsList";
import { useGroups } from "@/app/context/GroupsContext";
import { Empty, Space, Typography } from "antd";

export const Chat = () => {
  const { user } = useAuth();
  const [chatHeight, setChatHeight] = useState("630px");
  const { activeGroup } = useGroups();

  useEffect(() => {
    if (window.screen.width < 1150) {
      setChatHeight("90vh")
    }
  }, []);

  return (
    <div className="chat-container h-screen" style={{ height: chatHeight }}>

      <div style={{ 'textAlign': 'left', 'backgroundColor': 'white' }}>
        <div></div>
        <div style={{
          marginLeft: '0px',
          marginRight: '0px',
          display: 'flex',
          flexFlow: 'wrap',
          flexGrow: 0,
          flexShrink: 0,
          alignItems: 'normal',
          justifyContent: 'flex-start'
        }}>
          <div style={{
            boxSizing: 'border-box',
            minHeight: '1px',
            position: 'relative',
            padding: '0',
            width: '50%',
            flex: '0 0 50%',
            maxWidth: '50%',
            marginLeft: '0',
            right: 'auto',
            left: 'auto',
            height: '98vh',
          }}>
            <ChatList
              chatAppState={{
                userName: user?.name,
                renderChatCard: (chat, index) => <ChatCard group={chat} index={index} />,
                offset: 0,
                renderNewChatForm: (creds) => <NewChatForm />,
                onClose: () => 0
              }}
            />
          </div>
          <div style={{
            boxSizing: 'border-box',
            minHeight: '1px',
            position: 'relative',
            padding: '0',
            width: '50%',
            flex: '0 0 50%',
            maxWidth: '50%',
            marginLeft: '0',
            right: 'auto',
            left: 'auto',
            height: '98vh',
          }}>

            {(!activeGroup || activeGroup.length === 0) && (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <ChatHeader />
                <Empty
                  image="/images/selection.svg"
                  imageStyle={{ height: 256, width: 256, margin: '0 auto', paddingTop: '100px' }}
                  description={
                    <Space direction="vertical" size="large">
                      <Typography.Title level={2} style={{ color: 'var(--card-text-color)' }}>
                        Please select a group
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ color: 'var(--title-color)' }}>
                        Choose a group from the list to start chatting
                      </Typography.Text>
                    </Space>
                  }
                />
              </div>
            )}

            {(activeGroup && activeGroup.length > 0) && <div
              style={{
                height: '100%',
                maxHeight: '100vh',
                backgroundColor: 'rgb(240, 240, 240)'
              }}
              className="ce-chat-feed"
            >
              <ChatHeader />
              <EventsList />
              <ChatMessages />
              <NewMessageForm />
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

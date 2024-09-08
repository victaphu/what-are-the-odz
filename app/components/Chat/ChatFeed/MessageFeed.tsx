import React from 'react';
import MessageBubble from './Bubble/MessageBubble';
import { useChat } from '@/app/context/ChatContext';
import { Spin } from 'antd';

const ChatMessages: React.FC = () => {
  const { chats: messages, loading } = useChat();
  return (
    <div id="ce-feed-container" className="ce-chat-feed-container" style={{ width: '100%', height: '100%', maxHeight: '630px', overflow: 'hidden scroll', backgroundColor: 'white' }}>
      <div className="ce-feed-container-top" style={{ height: '220px' }}></div>
      {!loading && messages?.map((message, index) => (
        <MessageBubble
          key={message.id}
          lastMessage={index > 0 ? messages[index - 1] : undefined}
          message={message}
          nextMessage={index < messages.length - 1 ? messages[index + 1] : undefined}
          sending={false}
        />
      ))}
      {!loading && (!messages || messages?.length === 0) && <div id="ce-ice-breaker" style={{"width": "100%", "textAlign": "center", paddingTop: '100px'}}>
        <div id="ce-ice-breaker-text" style={{"color": "rgb(175, 175, 175)", "fontWeight": "600", "fontSize": "14px", "marginBottom": "6px"}}>No messages here yet...</div>
        <img id="ce-ice-breaker-gif" src="/images/peace.gif" alt="chat-engine-ice-breaker" style={{"width": "50%", "maxWidth": "200px"}} />
      </div>}

      {loading && (
        <div style={{ width: '100%', textAlign: 'center', paddingTop: '100px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '20px', fontWeight: 600, fontSize: '14px', color: 'var(--active-title)' }}>
            Loading group chat...
          </div>
        </div>
      )}

      <div className="ce-feed-container-bottom" style={{ "height": "86px" }}></div>
    </div>
  );
};

export default ChatMessages;
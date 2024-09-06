
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGroups } from './GroupsContext';
import { Message } from '../components/Chat/ChatFeed/Bubble/MessageBubble';

interface ChatContextType {
  chats: Message[] | null;
  loading: boolean;
  postMessage: (groupId: string, message: Partial<Message>) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const sampleChat: Record<string, Message[]> = {}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const { activeGroup } = useGroups();

  const loadChats = async () => {
    setLoading(true);
    try {
      // Simulate fetching chats from an API
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      setChats(sampleChat[activeGroup] || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeGroup || activeGroup.length === 0) return;

    loadChats();
  }, [activeGroup]);

  const postMessage = async (groupId: string, message: Partial<Message>) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!sampleChat[groupId]) {
        sampleChat[groupId] = [];
      }
      message.id = (sampleChat[groupId].length + 1) + "";
      sampleChat[groupId].push(message as Message);
      setChats([...sampleChat[groupId]]);
    }, 2000);
  }

  return (
    <ChatContext.Provider value={{ chats, loading, postMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

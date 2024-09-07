
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGroups } from './GroupsContext';
import { Message } from '../components/Chat/ChatFeed/Bubble/MessageBubble';

interface ChatContextType {
  chats: Message[] | null;
  loading: boolean;
  submittingChat: boolean;
  postMessage: (groupId: string, message: Partial<Message>) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);
const sampleChat: Record<string, Message[]> = {
  "1": [
    { id: "1", text: "Hello everyone!", sender: { username: "Alice", avatar: "https://randomuser.me/api/portraits/women/12.jpg" }, created: new Date("2023-05-01T10:00:00").toISOString(), sender_username: "Alice" },
    { id: "2", text: "Hi Alice, how are you?", sender: { username: "Bob", avatar: "https://randomuser.me/api/portraits/men/23.jpg" }, created: new Date("2023-05-01T10:05:00").toISOString(), sender_username: "Bob" },
    { id: "3", text: "I'm doing great, thanks for asking!", sender: { username: "Alice", avatar: "https://randomuser.me/api/portraits/women/12.jpg" }, created: new Date("2023-05-01T10:10:00").toISOString(), sender_username: "Alice" },
  ],
  "2": [
    { id: "1", text: "Hey everyone! Excited about Sarah and Tom's wedding this weekend?", sender: { username: "Emma", avatar: "https://randomuser.me/api/portraits/women/45.jpg" }, created: new Date("2023-06-01T09:00:00").toISOString(), sender_username: "Emma" },
    { id: "2", text: "Absolutely! I can't wait to see Sarah in her dress!", sender: { username: "Olivia", avatar: "https://randomuser.me/api/portraits/women/67.jpg" }, created: new Date("2023-06-01T09:05:00").toISOString(), sender_username: "Olivia" },
    { id: "3", text: "Me too! I heard it's a designer gown.", sender: { username: "Sophia", avatar: "https://randomuser.me/api/portraits/women/89.jpg" }, created: new Date("2023-06-01T09:10:00").toISOString(), sender_username: "Sophia" },
    { id: "4", text: "Tom's been so nervous. Wonder if he'll cry at the altar?", sender: { username: "Liam", avatar: "https://randomuser.me/api/portraits/men/34.jpg" }, created: new Date("2023-06-01T09:15:00").toISOString(), sender_username: "Liam" },
    { id: "5", text: "Oh, I bet he will! He's always been emotional.", sender: { username: "Emma", avatar: "https://randomuser.me/api/portraits/women/45.jpg" }, created: new Date("2023-06-01T09:20:00").toISOString(), sender_username: "Emma" },
    { id: "6", text: "Speaking of emotional, did you guys see the wedding cake yet?", sender: { username: "Noah", avatar: "https://randomuser.me/api/portraits/men/56.jpg" }, created: new Date("2023-06-01T09:25:00").toISOString(), sender_username: "Noah" },
    { id: "7", text: "No, what's it like?", sender: { username: "Ava", avatar: "https://randomuser.me/api/portraits/women/78.jpg" }, created: new Date("2023-06-01T09:30:00").toISOString(), sender_username: "Ava" },
    { id: "8", text: "It's a 5-tier masterpiece! White and gold with intricate floral designs.", sender: { username: "Noah", avatar: "https://randomuser.me/api/portraits/men/56.jpg" }, created: new Date("2023-06-01T09:35:00").toISOString(), sender_username: "Noah" },
    { id: "9", text: "Wow, sounds amazing! Can't wait to taste it.", sender: { username: "Sophia", avatar: "https://randomuser.me/api/portraits/women/89.jpg" }, created: new Date("2023-06-01T09:40:00").toISOString(), sender_username: "Sophia" },
    { id: "10", text: "Does anyone know what song they chose for their first dance?", sender: { username: "Liam", avatar: "https://randomuser.me/api/portraits/men/34.jpg" }, created: new Date("2023-06-01T09:45:00").toISOString(), sender_username: "Liam" },
    { id: "11", text: "I think it's 'At Last' by Etta James. Classic choice!", sender: { username: "Olivia", avatar: "https://randomuser.me/api/portraits/women/67.jpg" }, created: new Date("2023-06-01T09:50:00").toISOString(), sender_username: "Olivia" },
    { id: "12", text: "Oh, that's perfect for them! Sarah's going to look stunning walking down the aisle.", sender: { username: "Emma", avatar: "https://randomuser.me/api/portraits/women/45.jpg" }, created: new Date("2023-06-01T09:55:00").toISOString(), sender_username: "Emma" },
    { id: "13", text: "Definitely! And did you hear about Tom's surprise for her?", sender: { username: "Noah", avatar: "https://randomuser.me/api/portraits/men/56.jpg" }, created: new Date("2023-06-01T10:00:00").toISOString(), sender_username: "Noah" },
    { id: "14", text: "No, what surprise?", sender: { username: "Ava", avatar: "https://randomuser.me/api/portraits/women/78.jpg" }, created: new Date("2023-06-01T10:05:00").toISOString(), sender_username: "Ava" },
    { id: "15", text: "He's arranged for doves to be released after they say 'I do'!", sender: { username: "Noah", avatar: "https://randomuser.me/api/portraits/men/56.jpg" }, created: new Date("2023-06-01T10:10:00").toISOString(), sender_username: "Noah" },
    { id: "16", text: "That's so romantic! Sarah's going to love it.", sender: { username: "Sophia", avatar: "https://randomuser.me/api/portraits/women/89.jpg" }, created: new Date("2023-06-01T10:15:00").toISOString(), sender_username: "Sophia" },
    { id: "17", text: "I'm bringing tissues. Between Tom potentially crying and the doves, it's going to be emotional!", sender: { username: "Liam", avatar: "https://randomuser.me/api/portraits/men/34.jpg" }, created: new Date("2023-06-01T10:20:00").toISOString(), sender_username: "Liam" },
    { id: "18", text: "Good call, Liam! Oh, and don't forget, the dress code is black tie.", sender: { username: "Emma", avatar: "https://randomuser.me/api/portraits/women/45.jpg" }, created: new Date("2023-06-01T10:25:00").toISOString(), sender_username: "Emma" },
    { id: "19", text: "Thanks for the reminder! I need to pick up my tux from the dry cleaners.", sender: { username: "Noah", avatar: "https://randomuser.me/api/portraits/men/56.jpg" }, created: new Date("2023-06-01T10:30:00").toISOString(), sender_username: "Noah" },
    { id: "20", text: "Can't believe the big day is almost here. Here's to Sarah and Tom!", sender: { username: "Olivia", avatar: "https://randomuser.me/api/portraits/women/67.jpg" }, created: new Date("2023-06-01T10:35:00").toISOString(), sender_username: "Olivia" },
  ],
  "3": [
    { id: "1", text: "Hey guys, who's up for a movie night this weekend?", sender: { username: "Charlie", avatar: "https://randomuser.me/api/portraits/men/45.jpg" }, created: new Date("2023-06-05T18:00:00").toISOString(), sender_username: "Charlie" },
    { id: "2", text: "I'm in! What movie are we watching?", sender: { username: "Diana", avatar: "https://randomuser.me/api/portraits/women/67.jpg" }, created: new Date("2023-06-05T18:05:00").toISOString(), sender_username: "Diana" },
    { id: "3", text: "How about the new superhero film?", sender: { username: "Ethan", avatar: "https://randomuser.me/api/portraits/men/89.jpg" }, created: new Date("2023-06-05T18:10:00").toISOString(), sender_username: "Ethan" },
  ],
  "4": [
    { id: "1", text: "Team, let's discuss the project timeline.", sender: { username: "Manager", avatar: "https://randomuser.me/api/portraits/men/1.jpg" }, created: new Date("2023-06-10T09:00:00").toISOString(), sender_username: "Manager" },
    { id: "2", text: "Sure, I've prepared a draft schedule.", sender: { username: "Developer", avatar: "https://randomuser.me/api/portraits/women/2.jpg" }, created: new Date("2023-06-10T09:05:00").toISOString(), sender_username: "Developer" },
    { id: "3", text: "Great, can you share it with everyone?", sender: { username: "Manager", avatar: "https://randomuser.me/api/portraits/men/1.jpg" }, created: new Date("2023-06-10T09:10:00").toISOString(), sender_username: "Manager" },
  ],
  "5": [
    { id: "1", text: "Family, don't forget about our reunion next month!", sender: { username: "Mom", avatar: "https://randomuser.me/api/portraits/women/70.jpg" }, created: new Date("2023-06-15T20:00:00").toISOString(), sender_username: "Mom" },
    { id: "2", text: "Can't wait! Should I bring anything?", sender: { username: "Son", avatar: "https://randomuser.me/api/portraits/men/72.jpg" }, created: new Date("2023-06-15T20:05:00").toISOString(), sender_username: "Son" },
    { id: "3", text: "Just bring yourselves and good spirits!", sender: { username: "Dad", avatar: "https://randomuser.me/api/portraits/men/71.jpg" }, created: new Date("2023-06-15T20:10:00").toISOString(), sender_username: "Dad" },
  ],
};
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [submittingChat, setSubmitting] = useState(false);
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
    setSubmitting(true);
    setTimeout(() => {
      try {
        if (!sampleChat[groupId]) {
          sampleChat[groupId] = [];
        }
        message.id = (sampleChat[groupId].length + 1) + "";
        sampleChat[groupId].push(message as Message);
        setChats([...sampleChat[groupId]]);
      }
      finally {
        setSubmitting(false);
      }
    }, 2000);
  }

  return (
    <ChatContext.Provider value={{ chats, loading, postMessage, submittingChat }}>
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

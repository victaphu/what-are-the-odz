import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface XMTPContextType {
  createGroup: (address: string, groupAddresses: string[]) => Promise<any>;
  postMessage: (address: string, topic: string, content: string) => Promise<any>;
  getMessages: (address: string, topic: string) => Promise<any>;
  getMessageToSign: (address: string) => Promise<any>;
  register: (address: string, signedMessage: string) => Promise<any>;
}

const XMTPContext = createContext<XMTPContextType | undefined>(undefined);

export const XMTPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseUrl, setBaseUrl] = useState('http://localhost:5001'); // Adjust this if your server is running on a different port

  const createGroup = async (address: string, groupAddresses: string[]) => {
    try {
      const response = await axios.post(`${baseUrl}/newGroup`, { address, groupAddresses });
      return response.data.result;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const postMessage = async (address: string, topic: string, content: string) => {
    try {
      const response = await axios.post(`${baseUrl}/postMessage`, { address, topic, content });
      return response.data.result;
    } catch (error) {
      console.error('Error posting message:', error);
      throw error;
    }
  };

  const getMessages = async (address: string, topic: string) => {
    try {
      const response = await axios.post(`${baseUrl}/getMessages`, { address, topic });
      return response.data.result;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  };

  const getMessageToSign = async (address: string) => {
    try {
      const response = await axios.post(`${baseUrl}/clientSignatureText`, { address });
      return response.data.signatureText;
    } catch (error) {
      console.error('Error getting message to sign:', error);
      throw error;
    }
  };

  const register = async (address: string, signedMessage: string) => {
    try {
      const response = await axios.post(`${baseUrl}/register`, { address, signature: signedMessage });
      return response.data.result;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  const value = {
    createGroup,
    postMessage,
    getMessages,
    getMessageToSign,
    register,
  };

  return <XMTPContext.Provider value={value}>{children}</XMTPContext.Provider>;
};

export const useXMTP = () => {
  const context = useContext(XMTPContext);
  if (context === undefined) {
    throw new Error('useXMTP must be used within an XMTPProvider');
  }
  return context;
};

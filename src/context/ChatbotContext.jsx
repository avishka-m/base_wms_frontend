import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { chatbotService } from '../services/chatbotService';

export const ChatbotContext = createContext(null);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);

  // Load current conversation when chat is opened
  useEffect(() => {
    if (isOpen && currentConversation) {
      loadConversation(currentConversation);
    }
  }, [isOpen, currentConversation]);

  const loadConversation = async (conversationId) => {
    try {
      setLoading(true);
      const conversation = await chatbotService.getConversation(conversationId);
      if (conversation && conversation.messages) {
        setMessages(conversation.messages.map(msg => ({
          type: msg.role === 'user' ? 'user' : 'bot',
          content: msg.content
        })));
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const sendMessage = async (message, role, conversationId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add user message immediately
      setMessages(prev => [...prev, { type: 'user', content: message }]);
      
      const response = await chatbotService.sendMessage(message, role, conversationId);
      
      // Update current conversation if it's a new one
      if (response.conversation_id && (!conversationId || conversationId !== response.conversation_id)) {
        setCurrentConversation(response.conversation_id);
      }
      
      // Add bot response
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response.response || response.message 
      }]);

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Failed to send message. Please try again.' 
      }]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async (title, role) => {
    try {
      setLoading(true);
      setError(null);
      const conversation = await chatbotService.createConversation(title, role);
      setCurrentConversation(conversation.conversation_id);
      setMessages([]);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to create new conversation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const switchConversation = async (conversationId) => {
    try {
      setLoading(true);
      setError(null);
      await loadConversation(conversationId);
      setCurrentConversation(conversationId);
    } catch (error) {
      console.error('Error switching conversation:', error);
      setError('Failed to switch conversation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      setLoading(true);
      setError(null);
      await chatbotService.deleteConversation(conversationId);
      if (currentConversation === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isOpen,
    messages,
    loading,
    error,
    currentConversation,
    toggleChat,
    sendMessage,
    createNewConversation,
    switchConversation,
    deleteConversation
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotContext;
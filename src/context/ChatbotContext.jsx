import { createContext, useContext, useState, useEffect } from 'react';
import { chatbotService } from '../services/api';
import { useAuth } from './AuthContext';

// Create the chatbot context
const ChatbotContext = createContext();

// Custom hook to use the chatbot context
export const useChatbot = () => {
  return useContext(ChatbotContext);
};

// Chatbot provider component
export const ChatbotProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load conversation if ID exists
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;
      
      try {
        setLoading(true);
        const data = await chatbotService.getConversation(conversationId);
        
        if (data && data.messages) {
          setMessages(data.messages.map(msg => ({
            id: msg.timestamp,
            role: msg.role === 'assistant' ? 'bot' : 'user',
            content: msg.role === 'assistant' ? msg.response : msg.message,
            timestamp: msg.timestamp
          })));
        }
      } catch (err) {
        console.error('Failed to load conversation:', err);
        setError('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId]);

  // Send message to chatbot
  const sendMessage = async (messageText) => {
    if (!messageText.trim() || !currentUser) return;
    
    // Add user message to state immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      setLoading(true);
      setError(null);
      
      // Add loading message
      const loadingId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: loadingId,
        role: 'bot',
        content: '...',
        isLoading: true
      }]);
      
      // Send to API
      const response = await chatbotService.sendMessage(
        currentUser.role,
        messageText,
        conversationId
      );
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingId));
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 2,
        role: 'bot',
        content: response.response,
        timestamp: response.timestamp
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Save conversation ID if it's a new conversation
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
      }
      
      return response;
    } catch (err) {
      console.error('Failed to send message:', err);
      
      // Remove loading message if it exists
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now() + 3,
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.',
        isError: true
      }]);
      
      setError('Failed to get response from chatbot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setConversationId(null);
  };

  // Toggle chat visibility
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  // Context value
  const value = {
    messages,
    loading,
    error,
    conversationId,
    isChatOpen,
    sendMessage,
    clearConversation,
    toggleChat
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotContext;
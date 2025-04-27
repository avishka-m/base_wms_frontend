import { createContext, useState, useEffect } from 'react';
import { chatbotService } from '../services';
import { useAuth } from '../hooks/useAuth';

// Create the chatbot context
const ChatbotContext = createContext();

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
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Error loading conversation:', err);
        setError('Failed to load conversation history');
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId]);

  // Send message function
  const sendMessage = async (message) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await chatbotService.sendMessage(message, {
        conversationId,
        role: currentUser?.role || 'clerk'
      });
      
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
      }
      
      setMessages(prev => [...prev, 
        { id: Date.now(), role: 'user', content: message },
        { id: Date.now() + 1, role: 'assistant', content: response.reply }
      ]);
      
      return response;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  // Toggle chat
  const toggleChat = () => setIsChatOpen(prev => !prev);

  // Context value
  const value = {
    messages,
    loading,
    error,
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
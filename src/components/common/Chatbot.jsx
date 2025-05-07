import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import { useAuth } from '../../context/AuthContext';
import { XMarkIcon, PaperAirplaneIcon, ChatBubbleLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import ChatHistory from './ChatHistory';
import { chatbotService } from '../../services/chatbotService';

const Chatbot = () => {
  const { isOpen, messages, loading, toggleChat, sendMessage } = useChatbot();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !user?.role) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message, user.role.toLowerCase(), currentConversationId);
  };

  const handleNewConversation = async () => {
    try {
      const title = `Chat ${new Date().toLocaleString()}`;
      const conversation = await chatbotService.createConversation(title, user.role.toLowerCase());
      setCurrentConversationId(conversation.conversation_id);
      setShowHistory(false);
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  const handleSelectConversation = async (conversationId) => {
    if (conversationId) {
      try {
        const conversation = await chatbotService.getConversation(conversationId);
        setCurrentConversationId(conversationId);
        setShowHistory(false);
      } catch (error) {
        console.error('Error loading conversation:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Chat Assistant</h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-500 hover:text-gray-700"
            title="Chat History"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleNewConversation}
            className="text-gray-500 hover:text-gray-700"
            title="New Conversation"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
          <button
            onClick={toggleChat}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {showHistory ? (
        <ChatHistory
          onSelectConversation={handleSelectConversation}
          currentConversationId={currentConversationId}
        />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.type === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={user?.role ? "Type your message..." : "Please log in to chat"}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || !user?.role}
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || !user?.role}
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Chatbot; 
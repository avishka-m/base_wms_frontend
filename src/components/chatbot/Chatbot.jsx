import { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import { useAuth } from '../../hooks/useAuth';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import ChatMessage from './ChatMessage';

const Chatbot = () => {
  const { 
    messages, 
    loading, 
    sendMessage, 
    clearConversation, 
    isChatOpen, 
    toggleChat 
  } = useChatbot();
  const { currentUser } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const messageContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !loading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  // If chat is not open, just show the chat button
  if (!isChatOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-10 p-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all"
        aria-label="Open chatbot"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-10 md:right-6 md:bottom-6 flex flex-col bg-white rounded-t-lg md:rounded-lg shadow-xl border border-gray-200 w-full md:w-96 md:h-[32rem] transition-all">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary-500 text-white rounded-t-lg">
        <div className="flex items-center">
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
          <span className="font-medium">WMS Assistant</span>
          {currentUser && (
            <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full capitalize">
              {currentUser.role}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={clearConversation}
            className="p-1 hover:bg-white/20 rounded"
            aria-label="Clear conversation"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-white/20 rounded"
            aria-label="Close chatbot"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={messageContainerRef} 
        className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4"
        style={{ height: 'calc(100% - 120px)' }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">
                Hi there! I'm your warehouse assistant. How can I help you today?
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              role={currentUser?.role || 'clerk'}
            />
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={loading}
          />
          <button
            type="submit"
            className={`p-2 rounded-md ${
              loading || !inputMessage.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
            disabled={loading || !inputMessage.trim()}
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
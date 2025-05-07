import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useChatbot } from '../../hooks/useChatbot';

const ChatbotIcon = () => {
  const { toggleChat } = useChatbot();

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-4 right-4 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label="Toggle chatbot"
    >
      <ChatBubbleLeftRightIcon className="h-6 w-6" />
    </button>
  );
};

export default ChatbotIcon; 
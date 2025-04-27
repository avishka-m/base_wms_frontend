import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';

const ChatMessage = ({ message, role }) => {
  const { content, role: messageRole, isLoading, isError } = message;
  const [copied, setCopied] = useState(false);
  
  // Determine if the message is from the bot or the user
  const isBot = messageRole === 'bot';
  
  // Get appropriate avatar based on role and sender
  const getAvatar = () => {
    if (!isBot) {
      // User avatar - first letter of role
      return (
        <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
          {role.charAt(0).toUpperCase()}
        </div>
      );
    } else {
      // Bot avatar
      return (
        <div className="h-8 w-8 rounded-full bg-secondary-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M16.5 7.5h-9v9h9v-9Z" />
            <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
  };

  // Copy message content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isBot ? 'mr-2' : 'ml-2'}`}>
          {getAvatar()}
        </div>

        {/* Message content */}
        <div 
          className={`relative rounded-lg p-3 ${
            isBot 
              ? 'bg-gray-100 text-gray-800' 
              : 'bg-primary-500 text-white'
          } ${isError ? 'bg-red-100 text-red-800' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
            </div>
          ) : (
            <>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
              
              {/* Copy button - only for bot messages */}
              {isBot && content.length > 10 && (
                <button
                  onClick={copyToClipboard}
                  className="absolute -right-1 -top-1 p-1 rounded-full bg-white text-gray-500 shadow hover:bg-gray-100"
                  aria-label="Copy message"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
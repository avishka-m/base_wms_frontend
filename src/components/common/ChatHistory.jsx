import React, { useState, useEffect } from 'react';
import { chatbotService } from '../../services/chatbotService';
import { format, isValid, parseISO } from 'date-fns';

const ChatHistory = ({ onSelectConversation, currentConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  // Fetch conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await chatbotService.getConversations();
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await chatbotService.deleteConversation(conversationId);
        setConversations(conversations.filter(conv => conv.conversation_id !== conversationId));
        if (currentConversationId === conversationId) {
          onSelectConversation(null);
        }
      } catch (err) {
        setError('Failed to delete conversation');
        console.error('Error deleting conversation:', err);
      }
    }
  };

  const handleEditTitle = async (conversationId) => {
    if (!newTitle.trim()) {
      setEditingTitle(null);
      setNewTitle('');
      return;
    }

    try {
      await chatbotService.updateConversation(conversationId, newTitle);
      setConversations(conversations.map(conv => 
        conv.conversation_id === conversationId 
          ? { ...conv, title: newTitle }
          : conv
      ));
      setEditingTitle(null);
      setNewTitle('');
    } catch (err) {
      setError('Failed to update conversation title');
      console.error('Error updating conversation title:', err);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM d, yyyy HH:mm') : 'Invalid date';
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  if (loading) {
    return <div className="p-4">Loading conversations...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat History</h2>
      </div>
      <div className="divide-y">
        {conversations.length === 0 ? (
          <div className="p-4 text-gray-500">No conversations yet</div>
        ) : (
          conversations.map((conversation) => (
            <div 
              key={conversation.conversation_id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                currentConversationId === conversation.conversation_id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="flex-1"
                  onClick={() => onSelectConversation(conversation.conversation_id)}
                >
                  {editingTitle === conversation.conversation_id ? (
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleEditTitle(conversation.conversation_id)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEditTitle(conversation.conversation_id);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <h3 className="font-medium">{conversation.title}</h3>
                  )}
                  <div className="text-sm text-gray-500">
                    <span className="capitalize">{conversation.role}</span> • 
                    {conversation.message_count || 0} messages • 
                    Last updated: {formatDate(conversation.last_updated)}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTitle(conversation.conversation_id);
                      setNewTitle(conversation.title);
                    }}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conversation.conversation_id);
                    }}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory; 
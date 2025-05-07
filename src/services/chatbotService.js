import axios from 'axios';
import { api } from './apiConfig';

// Create a separate axios instance for the chatbot service
const chatbotApi = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
chatbotApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const chatbotService = {
  /**
   * Create a new conversation
   * @param {string} title - Title of the conversation
   * @param {string} role - Role to use for this conversation
   * @returns {Promise} New conversation information
   */
  async createConversation(title, role) {
    try {
      const response = await chatbotApi.post('/conversations', {
        title,
        role
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  /**
   * Send a message to the chatbot
   * @param {string} message - User's message
   * @param {string} role - User's role
   * @param {string} conversationId - Optional conversation ID
   * @returns {Promise} Chatbot's response
   */
  async sendMessage(message, role, conversationId = null) {
    try {
      const response = await chatbotApi.post('/chat', {
        message,
        role: role || localStorage.getItem('userRole') || 'user',
        conversation_id: conversationId || localStorage.getItem('chatConversationId')
      });

      // Store conversation ID if it's a new conversation
      if (response.data.conversation_id) {
        localStorage.setItem('chatConversationId', response.data.conversation_id);
      }

      return response.data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },

  /**
   * Get all conversations for the current user
   * @returns {Promise} List of conversations
   */
  async getConversations() {
    try {
      const response = await chatbotApi.get('/conversations');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  /**
   * Get a specific conversation by ID
   * @param {string} conversationId - ID of the conversation
   * @returns {Promise} Conversation details and messages
   */
  async getConversation(conversationId) {
    try {
      const response = await chatbotApi.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  /**
   * Update conversation metadata (title)
   * @param {string} conversationId - ID of the conversation
   * @param {string} title - New title for the conversation
   * @returns {Promise} Updated conversation information
   */
  async updateConversation(conversationId, title) {
    try {
      const response = await chatbotApi.put(`/conversations/${conversationId}`, {
        title
      });
      return response.data;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  },

  /**
   * Delete a conversation
   * @param {string} conversationId - ID of the conversation to delete
   * @returns {Promise} Success message
   */
  async deleteConversation(conversationId) {
    try {
      const response = await chatbotApi.delete(`/conversations/${conversationId}`);
      if (conversationId === localStorage.getItem('chatConversationId')) {
        localStorage.removeItem('chatConversationId');
      }
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  /**
   * Get user role and allowed chatbot roles
   * @returns {Promise} User role information
   */
  async getUserRole() {
    try {
      const response = await chatbotApi.get('/user/role');
      return response.data;
    } catch (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
  }
};
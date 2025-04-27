import { chatbotApi } from './apiConfig';

export const chatbotService = {
  sendMessage: async (role, message, conversationId = null) => {
    try {
      const response = await chatbotApi.post('/chat', {
        role,
        message,
        conversation_id: conversationId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getConversation: async (conversationId) => {
    try {
      const response = await chatbotApi.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
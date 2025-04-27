import { useContext } from 'react';
import ChatbotContext from '../context/ChatbotContext';

export const useChatbot = () => {
  return useContext(ChatbotContext);
};
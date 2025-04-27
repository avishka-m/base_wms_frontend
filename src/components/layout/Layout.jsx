import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Chatbot from '../chatbot/Chatbot';
import { useChatbot } from '../../context/ChatbotContext';

const Layout = () => {
  const { isChatOpen } = useChatbot();
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen size is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile when chat is open */}
      <div className={`${isMobile && isChatOpen ? 'hidden' : 'block'}`}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Chatbot - positioned absolutely on mobile, fixed container on desktop */}
      <Chatbot />
    </div>
  );
};

export default Layout;
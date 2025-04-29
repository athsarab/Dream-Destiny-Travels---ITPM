import React, { useState, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_KEY = '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';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hi! I'm your Sri Lanka travel assistant powered by AI. I can help you with detailed information about destinations, culture, history, and travel tips. How can I assist you today?", 
      isBot: true 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const conversationHistory = useRef([]);

  const sriLankaContext = `You are a knowledgeable Sri Lankan travel assistant. 
  Provide helpful information about Sri Lankan destinations, culture, history, travel tips, 
  accommodation, transportation, and attractions. Keep responses focused on Sri Lanka tourism.`;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "deepseek-ai/deepseek-chat-33b",
          messages: [
            {
              role: "system",
              content: "You are a knowledgeable Sri Lankan travel assistant. Provide detailed information about Sri Lankan destinations, culture, activities, and travel tips."
            },
            ...conversationHistory.current,
            { role: "user", content: userMessage }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'HTTP-Referer': window.location.href,
            'X-Title': 'Dream Destiny Travel Assistant',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.choices && response.data.choices[0]) {
        const botResponse = response.data.choices[0].message.content;
        conversationHistory.current.push(
          { role: "user", content: userMessage },
          { role: "assistant", content: botResponse }
        );

        setMessages(prev => [...prev, { 
          text: botResponse, 
          isBot: true 
        }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error details:', error.response || error);
      setMessages(prev => [...prev, { 
        text: "I apologize for the inconvenience. Let me try to help you - could you rephrase your question about Sri Lanka?", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg z-50"
      >
        <FaRobot size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 right-8 w-96 bg-gray-800 rounded-xl shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <FaRobot className="text-blue-400" size={20} />
                <h3 className="text-lg font-semibold text-white">Travel Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Messages with Loading Indicator */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-700 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700 text-white p-3 rounded-lg flex items-center gap-2">
                    <div className="animate-pulse">Thinking</div>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input with Loading State */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about Sri Lanka..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className={`bg-blue-500 text-white p-2 rounded-lg transition-colors
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                  <FaPaperPlane size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

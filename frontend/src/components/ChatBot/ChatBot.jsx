import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaMapMarkerAlt, FaHotel, FaUtensils, FaBus, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Ayubowan! 🙏 I'm your personal Sri Lanka travel assistant. I can help you with:", 
      isBot: true,
      quickReplies: [
        "Popular destinations",
        "Cultural sites",
        "Best beaches",
        "Wildlife safaris",
        "Train routes",
        "Local cuisine"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample knowledge base for Sri Lanka travel
  const sriLankaKnowledge = {
    "popular destinations": [
      "Sigiriya - Ancient rock fortress with stunning frescoes",
      "Kandy - Cultural capital with the Temple of the Sacred Tooth Relic",
      "Galle - Charming Dutch colonial fort city",
      "Nuwara Eliya - Cool hill station with tea plantations",
      "Mirissa - Beautiful beaches and whale watching",
      "Anuradhapura - Ancient Buddhist ruins and sacred sites"
    ],
    "cultural sites": [
      "Temple of the Tooth (Kandy) - Houses Buddha's sacred tooth relic",
      "Dambulla Cave Temple - Magnificent cave temples with Buddha statues",
      "Adam's Peak - Sacred mountain with the 'footprint' of Buddha/Adam/Shiva",
      "Polonnaruwa - Ancient city with well-preserved ruins",
      "Mihintale - Birthplace of Buddhism in Sri Lanka"
    ],
    "best beaches": [
      "Unawatuna - Popular beach with calm waters near Galle",
      "Mirissa - Great for whale watching and sunset views",
      "Bentota - Long sandy beach with water sports",
      "Arugam Bay - Surfing paradise on the east coast",
      "Nilaveli - Pristine beach near Trincomalee"
    ],
    "wildlife safaris": [
      "Yala National Park - Best for leopard sightings",
      "Udawalawe National Park - Many elephants and bird species",
      "Wilpattu National Park - Largest national park with natural lakes",
      "Minneriya National Park - Famous for 'The Gathering' of elephants",
      "Sinharaja Forest Reserve - UNESCO rainforest with endemic species"
    ],
    "train routes": [
      "Kandy to Ella - Famous scenic train through tea country",
      "Colombo to Galle - Coastal route along the south",
      "Colombo to Badulla - Longest route through diverse landscapes",
      "Colombo to Kandy - Main route to the hill country",
      "Batticaloa Line - Scenic east coast route"
    ],
    "local cuisine": [
      "Rice and Curry - The national dish with various curries",
      "Hoppers (Appa) - Bowl-shaped pancakes, often with egg",
      "Kottu Roti - Chopped roti with vegetables and meat",
      "String Hoppers - Steamed rice noodle patties",
      "Lamprais - Dutch-influenced rice packet with meat",
      "Pol Sambol - Spicy coconut relish",
      "Watalappan - Coconut custard dessert"
    ],
    "accommodation": [
      "Colombo: Luxury hotels like Shangri-La, Galle Face Hotel",
      "Kandy: Hilltop hotels with lake views",
      "Galle: Boutique hotels within the fort",
      "Ella: Eco-lodges with mountain views",
      "Beach areas: Resorts and guesthouses",
      "Cultural Triangle: Heritage bungalows"
    ],
    "transportation": [
      "Tuk-tuks: Best for short distances in cities",
      "Trains: Scenic and affordable for long distances",
      "Buses: Extensive network but can be crowded",
      "Private drivers: Convenient for multi-day trips",
      "Domestic flights: Available to Jaffna, Trinco, etc."
    ],
    "best time to visit": [
      "West/South Coasts & Hill Country: Dec-Mar (dry season)",
      "East Coast: Apr-Sep (best weather in Arugam Bay)",
      "Cultural Sites: Year-round, but cooler Nov-Feb",
      "Whale Watching: Nov-Apr off Mirissa",
      "Festivals: Esala Perahera (Jul/Aug) in Kandy is spectacular"
    ],
    "festivals": [
      "Sinhala & Tamil New Year (April)",
      "Vesak (May) - Buddha's birth/enlightenment/death",
      "Kandy Esala Perahera (July/Aug) - Grand procession",
      "Deepavali (Oct/Nov) - Hindu Festival of Lights",
      "Christmas (Dec 25) - Celebrated nationwide",
      "Thai Pongal (Jan) - Hindu harvest festival"
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Process the message
    const lowerMessage = userMessage.toLowerCase();
    let botResponse = "";
    let quickReplies = null;

    // Check for matches in our knowledge base
    for (const [key, value] of Object.entries(sriLankaKnowledge)) {
      if (lowerMessage.includes(key)) {
        botResponse = `Here's information about ${key} in Sri Lanka:\n\n${value.join('\n• ')}`;
        quickReplies = ["More about " + key, "Best time to visit", "Nearby attractions"];
        break;
      }
    }

    // If no specific match found, provide general response
    if (!botResponse) {
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        botResponse = "Ayubowan! Welcome to Sri Lanka. How can I help you plan your trip?";
        quickReplies = ["Where should I go?", "Best cultural sites", "Beach recommendations"];
      } else if (lowerMessage.includes('thank')) {
        botResponse = "You're welcome! Feel free to ask if you need more information about Sri Lanka.";
      } else if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('budget')) {
        botResponse = "Sri Lanka is generally affordable for travelers:\n\n" +
          "• Budget travel: $25-50/day\n" +
          "• Mid-range: $50-100/day\n" +
          "• Luxury: $150+/day\n\n" +
          "Entrance fees for major sites:\n" +
          "• Sigiriya: ~$30\n" +
          "• Temples: $5-10\n" +
          "• National Parks: $15-25";
      } else if (lowerMessage.includes('visa') || lowerMessage.includes('entry')) {
        botResponse = "Sri Lanka offers Electronic Travel Authorization (ETA):\n\n" +
          "• Most nationalities can get online visa\n" +
          "• Fee: ~$35 for 30-day tourist visa\n" +
          "• Can extend up to 6 months\n" +
          "• Passport valid for 6 months required";
      } else if (lowerMessage.includes('safety') || lowerMessage.includes('danger')) {
        botResponse = "Sri Lanka is generally safe for travelers:\n\n" +
          "• Exercise normal precautions\n" +
          "• Avoid political demonstrations\n" +
          "• Be careful with street food hygiene\n" +
          "• Mosquito protection recommended\n" +
          "• Emergency numbers: Police 119, Ambulance 110";
      } else {
        botResponse = "I'm happy to help with your Sri Lanka travel questions! Could you be more specific about what you'd like to know? For example:\n\n" +
          "• Best places to visit\n" +
          "• Cultural experiences\n" +
          "• Beach recommendations\n" +
          "• Wildlife safaris\n" +
          "• Transportation options";
        quickReplies = ["Popular destinations", "Cultural sites", "Best beaches", "Wildlife safaris"];
      }
    }

    setMessages(prev => [...prev, { 
      text: botResponse, 
      isBot: true,
      quickReplies: quickReplies 
    }]);
    setIsLoading(false);
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
    // Small delay to allow input to update before sending
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <>
      {/* Chat Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-[#005A34] text-white p-4 rounded-full shadow-lg z-50"
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
            className="fixed bottom-24 right-8 w-96 bg-white rounded-xl shadow-2xl z-50 flex flex-col"
            style={{ height: '70vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#005A34] text-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <FaRobot size={20} />
                <h3 className="text-lg font-semibold">Sri Lanka Travel Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-200 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                        ? 'bg-white text-gray-800 border border-gray-200'
                        : 'bg-[#005A34] text-white'
                    }`}
                  >
                    {message.text.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-2">{paragraph}</p>
                    ))}
                    {message.quickReplies && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.quickReplies.map((reply, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-800 p-3 rounded-lg border border-gray-200 flex items-center gap-2">
                    <div className="animate-pulse">Searching Sri Lanka travel info</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#005A34] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-[#005A34] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-[#005A34] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Buttons */}
            <div className="px-4 pt-2 pb-1 bg-gray-100 border-t border-gray-200 flex flex-wrap gap-1">
              <button 
                onClick={() => handleQuickReply("popular destinations")}
                className="flex items-center gap-1 text-xs bg-white hover:bg-gray-200 text-gray-800 px-2 py-1 rounded border border-gray-300"
              >
                <FaMapMarkerAlt /> Destinations
              </button>
              <button 
                onClick={() => handleQuickReply("accommodation")}
                className="flex items-center gap-1 text-xs bg-white hover:bg-gray-200 text-gray-800 px-2 py-1 rounded border border-gray-300"
              >
                <FaHotel /> Hotels
              </button>
              <button 
                onClick={() => handleQuickReply("local cuisine")}
                className="flex items-center gap-1 text-xs bg-white hover:bg-gray-200 text-gray-800 px-2 py-1 rounded border border-gray-300"
              >
                <FaUtensils /> Food
              </button>
              <button 
                onClick={() => handleQuickReply("transportation")}
                className="flex items-center gap-1 text-xs bg-white hover:bg-gray-200 text-gray-800 px-2 py-1 rounded border border-gray-300"
              >
                <FaBus /> Transport
              </button>
              <button 
                onClick={() => handleQuickReply("best time to visit")}
                className="flex items-center gap-1 text-xs bg-white hover:bg-gray-200 text-gray-800 px-2 py-1 rounded border border-gray-300"
              >
                <FaInfoCircle /> When to go
              </button>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about Sri Lanka travel..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005A34] disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className={`bg-[#005A34] text-white p-2 rounded-lg transition-colors
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#004527]'}`}
                >
                  <FaPaperPlane size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Ask about destinations, hotels, food, transport, and more
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
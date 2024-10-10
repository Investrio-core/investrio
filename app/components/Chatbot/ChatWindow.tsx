"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  X,
  ChevronDown,
  Sparkles,
  Settings,
  User,
  Sun,
  Moon,
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface SuggestionPrompt {
  id: number;
  text: string;
}

export default function PremiumChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openFrom, setOpenFrom] = useState<"button" | "input">("button");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestionPrompts: SuggestionPrompt[] = [
    // { id: 1, text: "What's my current balance?" },
    // { id: 2, text: "How can I improve my credit score?" },
    { id: 3, text: "Explain compound interest" },
    { id: 4, text: "Tips for budgeting" },
    { id: 5, text: "Investment strategies" },
    { id: 6, text: "Retirement planning" },
  ];

  const toggleChat = (from: "button" | "input" = "button") => {
    setIsOpen(!isOpen);
    setOpenFrom(from);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
      simulateBotResponse();
    }
  };

  const simulateBotResponse = () => {
    setIsTyping(true);
    const botMessage =
      " This is a simulated bot response to test the frontend UI component of the chat window. One day, hopefully, this will be a real chatbot that can answer your financial questions. For now, this is just a demo.";
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < botMessage.length - 1) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.sender === "bot") {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, text: lastMessage.text + botMessage[index] },
            ];
          } else {
            return [
              ...prevMessages,
              { id: Date.now(), text: botMessage[index], sender: "bot" },
            ];
          }
        });
        index++;
      } else {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 30);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const chatVariants = {
    hidden: (custom: "button" | "input") => ({
      opacity: 0,
      scale: 0.8,
      x: custom === "button" ? "calc(100% - 64px)" : 0,
      y: custom === "button" ? "calc(100% - 64px)" : 0,
    }),
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (custom: "button" | "input") => ({
      opacity: 0,
      scale: 0.8,
      x: custom === "button" ? "calc(100% - 64px)" : 0,
      y: custom === "button" ? "calc(100% - 64px)" : 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[1001] ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="chat-window"
              custom={openFrom}
              variants={chatVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`
                ${isDarkMode ? "dark" : ""}
                fixed sm:right-4 sm:bottom-20 w-full h-full sm:w-[400px] sm:h-[600px] 
                rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl 
                flex flex-col border border-gray-200
                ${
                  isDarkMode
                    ? "dark:bg-gray-900 dark:border-gray-700"
                    : "bg-white"
                }
              `}
            >
              <div className="bg-gradient-to-r from-[#8833FF] to-[#7722EE] text-white p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Vesty</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </motion.button>
                  <motion.button
                    onClick={() => toggleChat()}
                    className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                {suggestionPrompts.map((prompt) => (
                  <motion.button
                    key={prompt.id}
                    onClick={() => setInputValue(prompt.text)}
                    className="px-3 py-1 bg-[#8833FF]/10 dark:bg-[#8833FF]/20 text-[#8833FF] dark:text-[#AA77FF] rounded-full text-sm whitespace-nowrap hover:bg-[#8833FF]/20 dark:hover:bg-[#8833FF]/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {prompt.text}
                  </motion.button>
                ))}
              </div>
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-6"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-end space-x-3 ${
                        message.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : "flex-row"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8833FF] to-[#7722EE] flex-shrink-0 flex items-center justify-center text-white shadow-lg">
                        {message.sender === "user" ? (
                          <User size={20} />
                        ) : (
                          <Sparkles size={20} />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                          message.sender === "user"
                            ? "bg-[#8833FF] text-white"
                            : `${
                                isDarkMode
                                  ? "dark:bg-gray-800 dark:text-gray-200"
                                  : "bg-white text-gray-800"
                              }`
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="flex space-x-2"
                      >
                        <div className="w-2 h-2 bg-[#8833FF] rounded-full" />
                        <div className="w-2 h-2 bg-[#8833FF] rounded-full" />
                        <div className="w-2 h-2 bg-[#8833FF] rounded-full" />
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about your finances..."
                    className={`flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8833FF] ${
                      isDarkMode
                        ? "dark:bg-gray-800 dark:text-gray-200"
                        : "bg-white text-gray-800"
                    } transition-all duration-300 ease-in-out`}
                  />
                  <motion.button
                    type="submit"
                    className="bg-gradient-to-r from-[#8833FF] to-[#7722EE] text-white p-3 rounded-xl hover:opacity-90 transition-all duration-300 ease-in-out shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!isOpen && (
        <motion.button
          ref={buttonRef}
          onClick={() => toggleChat("button")}
          className="fixed bottom-[56px] right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-[#8833FF] to-[#7722EE] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-all duration-300 ease-in-out"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <Sparkles size={28} />
        </motion.button>
      )}
    </>
  );
}

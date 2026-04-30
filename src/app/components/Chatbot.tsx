import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { getToken } from '../api';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date | string; // Handle string from localStorage
}

// Simple markdown parser for basic formatting
const parseMarkdown = (text: string) => {
  // Split by code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Code block
      const code = part.slice(3, -3).replace(/^[\w-]+\n/, ''); // remove language tag
      return (
        <pre key={index} className="bg-gray-800 text-gray-100 p-2 rounded-md my-2 text-xs overflow-x-auto">
          <code>{code}</code>
        </pre>
      );
    } else {
      // Bold text
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bPart, bIndex) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return <strong key={`${index}-${bIndex}`} className="font-bold text-gray-900">{bPart.slice(2, -2)}</strong>;
        }
        return <span key={`${index}-${bIndex}`}>{bPart}</span>;
      });
    }
  });
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('career_navigator_chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (e) {
        setMessages(getInitialMessage());
      }
    } else {
      setMessages(getInitialMessage());
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('career_navigator_chat', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  const getInitialMessage = (): Message[] => [{
    id: '1',
    sender: 'bot',
    text: 'Hi! I am your AI Career Navigator Assistant. How can I help you with your learning path today?',
    timestamp: new Date().toISOString()
  }];

  const handleClearChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('career_navigator_chat');
    setMessages(getInitialMessage());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (ts: Date | string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://127.0.0.1:5000/api/chatbot/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.response || data.error || 'Sorry, I encountered an error.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Sorry, I am unable to connect to the server at the moment.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(79,70,229,0.3)] z-[100] transition-transform hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' }}
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed right-6 z-[100] flex flex-col overflow-hidden transition-all duration-300 ease-in-out shadow-[0_8px_32px_rgba(79,70,229,0.2)] rounded-[20px] backdrop-blur-[30px] border border-white/40`}
      style={{ 
        bottom: '24px',
        width: '380px',
        height: isMinimized ? '60px' : '600px',
        maxHeight: 'calc(100vh - 48px)',
        background: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between border-b border-gray-100 cursor-pointer group"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' }}
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
            <p className="text-white/80 text-xs">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleClearChat}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white opacity-0 group-hover:opacity-100"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-indigo-100' : 'bg-indigo-600'}`}>
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div 
                  className={`p-3 rounded-[16px] text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-[4px]' 
                      : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-[4px]'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{parseMarkdown(msg.text)}</div>
                  <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] self-start">
                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 bg-indigo-600">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="p-4 rounded-[16px] rounded-tl-[4px] bg-white border border-gray-100 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Ask me anything..."
                className="flex-1 max-h-[120px] min-h-[44px] resize-none rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                rows={1}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-11 h-11 shrink-0 rounded-[12px] bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

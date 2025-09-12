
import React, { useState, useRef, useEffect } from 'react';
import { VoiceInterface } from './VoiceInterface';
import { Send } from 'lucide-react';
import { geminiClient } from '../../../services/geminiClient';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface EnhancedChatInterfaceProps {
  onMessageSent: (message: string) => void;
  messages: Message[];
  isTyping: boolean;
}

export const EnhancedChatInterface = ({ onMessageSent, messages, isTyping }: EnhancedChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing || isStreaming) return;
    
    setIsProcessing(true);
    setIsStreaming(true);
    
    // Call the parent's onMessageSent for UI updates
    onMessageSent(inputValue);
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, { role: 'User', content: inputValue }]);
    
    try {
      // Generate Pan-African response with live routing intelligence
      const response = await geminiClient.generatePanAfricanResponse(
        inputValue,
        undefined, // Auto-extract origin
        undefined, // Auto-extract destination
        conversationHistory
      );
      
      // Add AI response to history
      setConversationHistory(prev => [...prev, { role: 'deepTalk', content: response }]);
      
      // Auto-speak response with enhanced voice
      await geminiClient.generateSpeech(response);
      
    } catch (error) {
      console.error('Failed to generate Pan-African response:', error);
      // Fallback to standard oracle response
      try {
        const fallbackResponse = await geminiClient.generateOracleResponse(
          inputValue,
          "Pan-African logistics intelligence with symbolic reasoning",
          'conversational'
        );
        setConversationHistory(prev => [...prev, { role: 'deepTalk', content: fallbackResponse }]);
        await geminiClient.generateSpeech(fallbackResponse);
      } catch (fallbackError) {
        console.error('Fallback response failed:', fallbackError);
        setConversationHistory(prev => [...prev, { 
          role: 'deepTalk', 
          content: '⚠️ Connection to DeepCAL headquarters temporarily disrupted. Please try again.' 
        }]);
      }
    }
    
    setInputValue('');
    setIsProcessing(false);
    setIsStreaming(false);
  };

  const handleVoiceMessage = (message: string) => {
    setIsProcessing(true);
    onMessageSent(message);
    
    // Reset processing state after a delay
    setTimeout(() => setIsProcessing(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-fade-in`}>
            {message.type === 'ai' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-deepcal-purple flex items-center justify-center mr-3">
                <i className="fas fa-infinity text-white text-xs"></i>
              </div>
            )}
            
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 ${
              message.type === 'user' 
                ? 'bg-slate-700 text-slate-100' 
                : 'bg-deepcal-purple bg-opacity-50 text-deepcal-light'
            }`}>
              <p className="whitespace-pre-line">{message.content}</p>
            </div>
            
            {message.type === 'user' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center ml-3">
                <i className="fas fa-user text-slate-300 text-xs"></i>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start message-fade-in">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-deepcal-purple flex items-center justify-center mr-3">
              <i className="fas fa-infinity text-white text-xs"></i>
            </div>
            <div className="bg-deepcal-purple bg-opacity-50 rounded-xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-deepcal-light rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-deepcal-light rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-deepcal-light rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center bg-slate-800 rounded-full px-4 py-3 mb-4">
          <input
            type="text"
            placeholder="Ask about routes across Africa: Lagos to Nairobi, carriers, costs, risks..."
            className="flex-grow bg-transparent outline-none px-3 text-slate-200 placeholder-slate-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="p-2 rounded-full bg-deepcal-purple text-white hover:bg-deepcal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <VoiceInterface 
          onUserMessage={handleVoiceMessage}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

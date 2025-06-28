
import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metrics?: {
    name: string;
    value: string | number;
    color: string;
    width: string;
  }[];
  note?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Greetings! I am DeepCAL, your advanced logistics oracle powered by Neutrosophic AI and Storytelling Analytics. With my enhanced Scenario Engine, Bayesian-Neural Fusion, and Explainable AI, I can provide deep insights into:\n\n• Shipment optimization with uncertainty quantification\n• Multi-criteria decision analysis (AHP-TOPSIS)\n• Predictive risk assessment and alternative scenarios\n• Natural language explanations of complex logistics decisions',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleResponses: Record<string, { response: string; metrics?: any[]; note?: string }> = {
    "Fastest route to Mali": {
      response: "For Mali, our Neutrosophic AHP analysis recommends air freight via Dakar (DHL) as optimal for speed.\n\nKey factors:\n- Transit time: 2 days (95% speed score)\n- Reliability: 85% on-time\n- Bayesian risk assessment: Low (12% disruption chance)\n\nScenario Engine evaluated 7 alternatives, with this route scoring highest in our N-TOPSIS model (0.87 closeness coefficient).",
      metrics: [
        {name: "Speed Score", value: "9.5/10", color: "blue", width: "95%"},
        {name: "Cost Premium", value: "High", color: "amber", width: "30%"}
      ],
      note: "Alternative analysis: Sea+road scored 0.72 with 70% cost savings but higher uncertainty (±2d)"
    },
    "Cheapest shipping option": {
      response: "The most cost-effective option is sea freight to Mombasa with Maersk, then road transport. Total cost estimate: $1,850 for 2 tons. Transit time: 18 days with 75% reliability.",
      metrics: [
        {name: "Cost Score", value: "9.8/10", color: "green", width: "98%"},
        {name: "Time Tradeoff", value: "Slow", color: "red", width: "20%"}
      ],
      note: "Best for non-urgent, high-volume shipments"
    },
    "Compare Dakar vs Nairobi": {
      response: "Comparison for East Africa shipments:\n\nDakar Hub:\n- Avg transit: 5 days\n- Cost: $2,200\n- Reliability: 82%\n\nNairobi Hub:\n- Avg transit: 3 days\n- Cost: $2,500\n- Reliability: 88%\n\nNairobi is faster but 14% more expensive.",
      note: "Consider Dakar for West Africa destinations"
    },
    "Current risks via Mombasa": {
      response: "Mombasa port currently has moderate risk (Level 2/5):\n- Weather delays: 15% chance\n- Customs backlog: 2-day average\n- Security: Normal\n\nRecommendation: Add 2-day buffer for shipments this week.",
      metrics: [
        {name: "Risk Score", value: "4.2/10", color: "orange", width: "42%"}
      ],
      note: "Situation monitored daily - check for updates"
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseData = sampleResponses[inputValue] || {
        response: "I understand you're asking about logistics in Africa. As your oracle, I can analyze routes, compare options, assess risks, and optimize shipments. Could you please clarify your specific need?",
        note: "The more details you provide, the better I can assist"
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: responseData.response,
        timestamp: new Date(),
        metrics: responseData.metrics,
        note: responseData.note,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="oracle-card overflow-hidden flex flex-col h-[700px]">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-deepcal-purple rounded-full flex items-center justify-center">
                        <i className="fas fa-infinity text-white"></i>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                    </div>
                    <div>
                      <h2 className="font-bold text-white">Oracle</h2>
                      <p className="text-xs text-purple-100">DeepTalk Conversational AI</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition">
                      <i className="fas fa-microphone text-white"></i>
                    </button>
                    <button className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition">
                      <i className="fas fa-ellipsis-v text-white"></i>
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-800/20">
                  {messages.map((message) => (
                    <div key={message.id} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : ''}`}>
                      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${
                        message.type === 'user' 
                          ? 'bg-deepcal-purple text-white rounded-l-xl rounded-br-xl' 
                          : 'bg-slate-700/50 text-slate-100 rounded-r-xl rounded-bl-xl'
                      } shadow p-4`}>
                        <div className={`flex items-center mb-2 ${message.type === 'user' ? 'justify-end' : ''}`}>
                          {message.type === 'ai' && (
                            <div className="w-6 h-6 bg-deepcal-purple rounded-full flex items-center justify-center mr-2">
                              <i className="fas fa-infinity text-white text-xs"></i>
                            </div>
                          )}
                          <span className="font-bold text-sm">{message.type === 'user' ? 'You' : 'Oracle'}</span>
                          {message.type === 'user' && (
                            <div className="w-6 h-6 bg-slate-600 rounded-full ml-2"></div>
                          )}
                        </div>
                        <p className="whitespace-pre-line">{message.content}</p>
                        
                        {/* Metrics */}
                        {message.metrics && message.metrics.map((metric, index) => (
                          <div key={index} className="mt-3 bg-slate-600/30 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{metric.name}</span>
                              <span className="text-sm font-bold">{metric.value}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className={`bg-${metric.color}-500 h-2 rounded-full`} style={{width: metric.width}}></div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Note */}
                        {message.note && (
                          <div className="mt-2 text-sm text-slate-300">
                            <i className="fas fa-info-circle mr-1 text-deepcal-light"></i> {message.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="mb-4 flex">
                      <div className="max-w-xs bg-slate-700/50 rounded-r-xl rounded-bl-xl shadow p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-deepcal-purple rounded-full flex items-center justify-center mr-2">
                            <i className="fas fa-infinity text-white text-xs"></i>
                          </div>
                          <span className="font-bold text-sm text-slate-100">Oracle</span>
                        </div>
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
                <div className="border-t border-slate-700 p-4 bg-slate-800/30">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-slate-200">
                      <i className="fas fa-paperclip"></i>
                    </button>
                    <input
                      type="text"
                      placeholder="Ask the oracle about your shipment..."
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-full py-2 px-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-deepcal-light focus:border-transparent"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="p-2 bg-deepcal-purple text-white rounded-full hover:bg-deepcal-light transition"
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { text: "Fastest", prompt: "Fastest route to Mali", icon: "fas fa-bolt" },
                      { text: "Cheapest", prompt: "Cheapest shipping option", icon: "fas fa-coins" },
                      { text: "Compare", prompt: "Compare Dakar vs Nairobi", icon: "fas fa-balance-scale" },
                      { text: "Risks", prompt: "Current risks via Mombasa", icon: "fas fa-exclamation-triangle" }
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(item.prompt)}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-full transition flex items-center"
                      >
                        <i className={`${item.icon} mr-1 text-deepcal-light`}></i> {item.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Panel - Analytics */}
            <div className="lg:col-span-1 space-y-6">
              {/* Shipment Map */}
              <div className="oracle-card overflow-hidden">
                <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple text-white p-3 flex items-center justify-between">
                  <h3 className="font-bold flex items-center">
                    <i className="fas fa-map-marked-alt mr-2"></i> Hawk's Eye View
                  </h3>
                  <button className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition">
                    <i className="fas fa-sync-alt mr-1"></i> Refresh
                  </button>
                </div>
                <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  <div className="map-grid"></div>
                  {/* Map markers */}
                  <div className="absolute top-1/4 left-1/4 shipment-node" title="Nairobi"></div>
                  <div className="absolute top-1/3 left-1/2 shipment-node" title="Kampala"></div>
                  <div className="absolute top-1/2 left-2/3 shipment-node" title="Juba"></div>
                  <div className="absolute top-2/3 left-1/3 shipment-node" title="Dakar"></div>
                  <div className="absolute top-3/4 left-3/4 shipment-node" title="Mombasa"></div>
                  
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                    <i className="fas fa-plane text-deepcal-light mr-1"></i> 12 active shipments
                  </div>
                </div>
                <div className="p-3 border-t border-slate-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-200">Current Focus:</span>
                    <span className="bg-deepcal-purple/20 text-deepcal-light px-2 py-1 rounded-full text-xs">East Africa Corridor</span>
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="oracle-card overflow-hidden">
                <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple text-white p-3">
                  <h3 className="font-bold flex items-center">
                    <i className="fas fa-chart-pie mr-2"></i> Route Performance
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="bg-slate-700/30 p-3 rounded-lg mb-3">
                    <h4 className="font-medium text-sm mb-2 text-slate-200">DeepCAL Algorithm Workflow:</h4>
                    <div className="text-xs space-y-1">
                      {[
                        "Scenario Engine & RFQ Generation",
                        "Neutrosophic AHP Weighting", 
                        "N-TOPSIS Scoring",
                        "Bayesian-Neural Fusion"
                      ].map((step, index) => (
                        <div key={index} className="flex items-center">
                          <span className="bg-deepcal-purple text-white px-2 py-1 rounded mr-2 text-xs">{index + 1}</span>
                          <span className="text-slate-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Performance bars */}
                  {[
                    { name: "On-Time Delivery", value: 87, color: "green" },
                    { name: "Cost Efficiency", value: 78, color: "blue" },
                    { name: "Risk Mitigation", value: 92, color: "purple" }
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-200">{metric.name}</span>
                        <span className="text-sm font-bold text-slate-100">{metric.value}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className={`bg-${metric.color}-500 h-2 rounded-full`} style={{width: `${metric.value}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="oracle-card overflow-hidden">
                <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple text-white p-3">
                  <h3 className="font-bold flex items-center">
                    <i className="fas fa-bolt mr-2"></i> Quick Actions
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2">
                  {[
                    { icon: "fas fa-shipping-fast", text: "New Shipment", color: "blue" },
                    { icon: "fas fa-file-invoice-dollar", text: "Get Quote", color: "green" },
                    { icon: "fas fa-road", text: "Route Check", color: "amber" },
                    { icon: "fas fa-book", text: "Story Mode", color: "purple" }
                  ].map((action, index) => (
                    <button key={index} className={`flex items-center justify-center space-x-2 bg-${action.color}-500/10 hover:bg-${action.color}-500/20 p-3 rounded-lg transition`}>
                      <i className={`${action.icon} text-${action.color}-400`}></i>
                      <span className="text-sm text-slate-200">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;

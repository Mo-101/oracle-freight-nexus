import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { EnhancedChatInterface } from '../components/chat/EnhancedChatInterface';
import { VoiceTestButton } from '../components/chat/VoiceTestButton';
import { newTTSService } from '../services/newTTSService';

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
      content: 'This is DeepCAL. How may I support your intelligence today? I am your advanced logistics oracle powered by Neutrosophic AI and Storytelling Analytics. With my enhanced Scenario Engine, Bayesian-Neural Fusion, and Explainable AI, I can provide deep insights into your freight and supply chain endeavors.',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const sampleResponses: Record<string, { response: string; metrics?: any[]; note?: string }> = {
    "fastest route to mali": {
      response: "For Mali, our Neutrosophic AHP analysis recommends air freight via Dakar (DHL) as optimal for speed.\n\nKey factors:\n- Transit time: 2 days (95% speed score)\n- Reliability: 85% on-time\n- Bayesian risk assessment: Low (12% disruption chance)\n\nScenario Engine evaluated 7 alternatives, with this route scoring highest in our N-TOPSIS model (0.87 closeness coefficient).",
      metrics: [
        {name: "Speed Score", value: "9.5/10", color: "blue", width: "95%"},
        {name: "Cost Premium", value: "High", color: "amber", width: "30%"}
      ],
      note: "Alternative analysis: Sea+road scored 0.72 with 70% cost savings but higher uncertainty (±2d)"
    },
    "cheapest shipping option": {
      response: "The most cost-effective option is sea freight to Mombasa with Maersk, then road transport. Total cost estimate: $1,850 for 2 tons. Transit time: 18 days with 75% reliability.",
      metrics: [
        {name: "Cost Score", value: "9.8/10", color: "green", width: "98%"},
        {name: "Time Tradeoff", value: "Slow", color: "red", width: "20%"}
      ],
      note: "Best for non-urgent, high-volume shipments"
    },
    "hello": {
      response: "Hello! I'm DeepCAL, your intelligence augmentation assistant specialized in African logistics. What freight challenge can I help you solve today?"
    },
    "hi": {
      response: "Greetings! I'm here to assist with your logistics intelligence needs. How may I enhance your supply chain decisions today?"
    }
  };

  useEffect(() => {
    // Play welcome message on component mount
    if (voiceEnabled && messages.length > 0) {
      const welcomeMessage = messages[0].content;
      setTimeout(() => {
        handleSpeakResponse(welcomeMessage);
      }, 1000);
    }
  }, []);

  const handleSendMessage = async (inputValue: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(async () => {
      const lowerInput = inputValue.toLowerCase();
      const responseData = sampleResponses[lowerInput] || {
        response: "That's an interesting logistics challenge. Let me analyze that for you using my DeepCAL intelligence engine. Based on my processing of 105 canonical shipments and neutrosophic analysis, I recommend exploring this topic further through our advanced freight optimization algorithms. Would you like me to suggest specific optimization strategies?",
        note: "DeepCAL processes real shipment data to provide actionable insights"
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

      // Auto-speak AI responses
      if (voiceEnabled) {
        setTimeout(() => {
          handleSpeakResponse(responseData.response);
        }, 500);
      }
    }, 1500);
  };

  const handleSpeakResponse = async (text: string) => {
    try {
      const audioUrl = await newTTSService.generateSpeech(text, {
        voice: 'alloy',
        emotion: 'conversational, wise and helpful African logistics expert',
        useRandomSeed: true
      });
      
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().then(() => {
          audio.onended = () => URL.revokeObjectURL(audioUrl);
        }).catch(console.error);
      }
    } catch (error) {
      console.error('Voice synthesis failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-deepcal-dark">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Enhanced Chat Interface */}
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
                      <h2 className="font-bold text-white">DeepTalk Oracle</h2>
                      <p className="text-xs text-purple-100">Enhanced Voice Intelligence System</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <VoiceTestButton />
                    <button 
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`p-2 rounded-full transition ${
                        voiceEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                      title={voiceEnabled ? "Disable voice" : "Enable voice"}
                    >
                      <i className={`fas ${voiceEnabled ? 'fa-volume-up' : 'fa-volume-mute'} text-white`}></i>
                    </button>
                  </div>
                </div>
                
                <EnhancedChatInterface 
                  onMessageSent={handleSendMessage}
                  messages={messages}
                  isTyping={isTyping}
                />
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
      
      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
          100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        .message-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Chat;

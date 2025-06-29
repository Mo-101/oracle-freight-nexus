
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { VoiceChat } from '../components/chat/VoiceChat';

const Chat = () => {
  const [lastResponse, setLastResponse] = useState<string>('');

  const handleSpeakResponse = (text: string) => {
    setLastResponse(text);
    console.log('Oracle spoke:', text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepcal-dark via-slate-900 to-deepcal-dark">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <VoiceChat 
          onSpeakResponse={handleSpeakResponse}
          isEnabled={true}
        />
        {lastResponse && (
          <div className="mt-6 p-4 oracle-card">
            <h3 className="text-deepcal-light font-semibold mb-2">Latest Oracle Response:</h3>
            <p className="text-slate-300">{lastResponse}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;

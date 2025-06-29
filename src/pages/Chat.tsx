
import React from 'react';
import { Header } from '../components/Header';
import { VoiceChat } from '../components/chat/VoiceChat';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-deepcal-dark via-slate-900 to-deepcal-dark">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <VoiceChat />
      </main>
    </div>
  );
};

export default Chat;

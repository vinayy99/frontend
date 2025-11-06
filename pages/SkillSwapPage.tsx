// src/pages/SkillSwapPage.tsx

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { SkillSwapMessage, SkillSwapStatusHistory } from '../types';
import * as api from '../services/api';

const SkillSwapPage: React.FC = () => {
  const { currentUser, skillSwaps, token } = useAppContext();
  const [activeSwapId, setActiveSwapId] = useState<number | null>(null);
  const [messages, setMessages] = useState<SkillSwapMessage[]>([]);
  const [history, setHistory] = useState<SkillSwapStatusHistory[]>([]);
  const [text, setText] = useState('');

  if (!currentUser) return null;

  useEffect(() => {
    if (!token || !activeSwapId) return;

    (async () => {
      setMessages(await api.getSkillSwapMessages(activeSwapId, token));
      setHistory(await api.getSkillSwapHistory(activeSwapId, token));
    })();

  }, [activeSwapId, token]);

  const sendMessage = async () => {
    if (!text.trim() || !token || !activeSwapId) return;
    const msg = await api.postSkillSwapMessage(activeSwapId, text, token);
    setMessages(prev => [...prev, msg]);
    setText('');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Skill Swap Requests</h1>

      {skillSwaps.map(swap =>
        <div key={swap.id} onClick={() => setActiveSwapId(swap.id)} className="p-3 border rounded mb-3 cursor-pointer">
          {swap.message} — <b>{swap.status}</b>
        </div>
      )}

      {activeSwapId && (
        <div className="mt-6">
          <h2 className="font-semibold">Chat</h2>
          <div className="border h-60 overflow-y-auto p-3 mb-2 bg-gray-50">
            {messages.map(m => (
              <p key={m.id}><b>{m.sender_name}:</b> {m.message}</p>
            ))}
          </div>

          <input value={text} onChange={e => setText(e.target.value)} className="border p-2 w-full mb-2" placeholder="Message..." />
          <button onClick={sendMessage} className="bg-blue-600 text-white px-3 py-1 rounded">Send</button>

          <h2 className="font-semibold mt-6">Status Timeline</h2>
          {history.map(h => (
            <p key={h.id}>{h.status} at {new Date(h.created_at!).toLocaleString()}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillSwapPage;

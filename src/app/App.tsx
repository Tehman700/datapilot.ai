import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { VersionControl } from './components/VersionControl';
import { DataVisualization } from './components/DataVisualization';
import { Download } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  reason: string;
  impact: number;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  biasChange?: { from: number; to: number };
  timestamp: string;
}

interface Version {
  id: string;
  name: string;
  timestamp: string;
  biasScore: number;
  isBest?: boolean;
}

export default function App() {
  const [biasScore, setBiasScore] = useState(0.68);
  const [genderBias, setGenderBias] = useState(0.42);
  const [dataImbalance, setDataImbalance] = useState(0.31);
  const [confidence] = useState(87);
  const [biasHistory] = useState([0.85, 0.78, 0.72, 0.68, 0.65, 0.68]);

  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Normalize Income',
      reason: 'Reduces gender bias by 12%',
      impact: 0.12
    },
    {
      id: '2',
      title: 'Balance Age Groups',
      reason: 'Equal representation across demographics',
      impact: 0.08
    },
    {
      id: '3',
      title: 'Remove Regional Outliers',
      reason: 'Eliminates location-based skew',
      impact: 0.15
    },
    {
      id: '4',
      title: 'Standardize Education Levels',
      reason: 'Consistent encoding reduces bias',
      impact: 0.07
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      content: 'Remove outliers in age column',
      timestamp: '10 min ago'
    },
    {
      id: '2',
      type: 'ai',
      content: 'Action taken: 124 outliers removed. Explanation: Age outliers were skewing gender comparison and creating artificial bias in income distribution.',
      biasChange: { from: 0.72, to: 0.68 },
      timestamp: '10 min ago'
    }
  ]);

  const [versions] = useState<Version[]>([
    {
      id: '1',
      name: 'Raw Data',
      timestamp: '15 min ago',
      biasScore: 0.85
    },
    {
      id: '2',
      name: 'Normalized Income',
      timestamp: '12 min ago',
      biasScore: 0.72
    },
    {
      id: '3',
      name: 'Removed Outliers',
      timestamp: '10 min ago',
      biasScore: 0.68,
      isBest: true
    }
  ]);

  const [selectedVersion, setSelectedVersion] = useState('3');

  const handleRecommendationClick = (rec: Recommendation) => {
    const newBiasScore = Math.max(0, biasScore - rec.impact);
    const timestamp = 'Just now';

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Apply recommendation: ${rec.title}`,
      timestamp
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: `Action completed: ${rec.title}. ${rec.reason}`,
      biasChange: { from: biasScore, to: newBiasScore },
      timestamp
    };

    setMessages([...messages, userMessage, aiMessage]);
    setBiasScore(newBiasScore);
    setGenderBias(Math.max(0, genderBias - rec.impact * 0.5));
    setDataImbalance(Math.max(0, dataImbalance - rec.impact * 0.3));
  };

  const handleSendMessage = (content: string) => {
    const timestamp = 'Just now';
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp
    };

    const reduction = 0.03 + Math.random() * 0.05;
    const newBiasScore = Math.max(0, biasScore - reduction);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: `Action completed. Your request has been processed and applied to the dataset. This modification has improved the bias metrics.`,
      biasChange: { from: biasScore, to: newBiasScore },
      timestamp
    };

    setMessages([...messages, userMessage, aiMessage]);
    setBiasScore(newBiasScore);
  };

  const handleUndo = (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0 && messages[messageIndex].biasChange) {
      const biasChange = messages[messageIndex].biasChange!;
      setBiasScore(biasChange.from);
      setMessages(messages.filter((_, i) => i < messageIndex - 1));
    }
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden transition-colors duration-300">
      <Navbar
        biasScore={biasScore}
        genderBias={genderBias}
        dataImbalance={dataImbalance}
        confidence={confidence}
        biasHistory={biasHistory}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          recommendations={recommendations}
          onRecommendationClick={handleRecommendationClick}
        />

        <div className="flex-1 flex">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onUndo={handleUndo}
          />
        </div>

        <div className="w-[380px] flex flex-col border-l border-border">
          <VersionControl
            versions={versions}
            selectedVersion={selectedVersion}
            onVersionSelect={setSelectedVersion}
          />
          <DataVisualization selectedVersion={selectedVersion} />
        </div>
      </div>

      {/* Download Button */}
      <button className="fixed bottom-8 right-8 px-6 py-3 rounded-full bg-[#A3E635] hover:bg-[#10B981] border border-[#A3E635] text-[#0A0A0A] font-semibold flex items-center gap-2 shadow-lg shadow-[#A3E635]/20 transition-all hover:scale-105">
        <Download className="h-5 w-5" />
        Download Dataset
      </button>
    </div>
  );
}
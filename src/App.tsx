/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { 
  Brain, Send, AlertCircle, CheckCircle2, BarChart3, 
  Smile, Frown, Angry, AlertTriangle, Ghost, Search,
  ChevronRight, RefreshCw, MessageSquare
} from 'lucide-react';

interface EmotionResult {
  anger: number;
  disgust: number;
  fear: number;
  joy: number;
  sadness: number;
  dominant_emotion: string;
  error?: string;
}

const EMOTION_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  joy: { color: '#fbbf24', icon: <Smile className="w-5 h-5" />, label: 'Joy' },
  sadness: { color: '#3b82f6', icon: <Frown className="w-5 h-5" />, label: 'Sadness' },
  anger: { color: '#ef4444', icon: <Angry className="w-5 h-5" />, label: 'Anger' },
  disgust: { color: '#10b981', icon: <AlertTriangle className="w-5 h-5" />, label: 'Disgust' },
  fear: { color: '#8b5cf6', icon: <Ghost className="w-5 h-5" />, label: 'Fear' },
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmotion = async () => {
    if (!inputText.trim()) {
      setError("Please enter some feedback for analysis.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze text');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Joy', value: result.joy, color: EMOTION_CONFIG.joy.color },
    { name: 'Sadness', value: result.sadness, color: EMOTION_CONFIG.sadness.color },
    { name: 'Anger', value: result.anger, color: EMOTION_CONFIG.anger.color },
    { name: 'Disgust', value: result.disgust, color: EMOTION_CONFIG.disgust.color },
    { name: 'Fear', value: result.fear, color: EMOTION_CONFIG.fear.color },
  ].filter(d => d.value > 0) : [];

  const dominant = result?.dominant_emotion || '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
          <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Emotion Analytics AI</h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Advanced NLP processing to decode customer sentiments. 
          Analyze feedback, iterate on products, and understand your audience.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 flex flex-col"
        >
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-medium">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span>Customer Feedback</span>
            </div>
            
            <textarea
              id="feedback-input"
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-700 leading-relaxed"
              placeholder="Example: I'm absolutely frustrated with the shipping delays! I love the product quality but the waiting time is a nightmare..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <div className="mt-6 flex items-center justify-between">
              <button
                id="analyze-btn"
                onClick={analyzeEmotion}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-semibold text-white transition-all transform active:scale-95 ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                }`}
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Run AI Analysis</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </div>

          <div className="mt-6 bg-slate-900 p-6 rounded-3xl text-white shadow-xl overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-medium mb-2">Pro Analytics Mode</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Connect your Shopify or Amazon feedback directly to this engine.
              </p>
              <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors inline-flex items-center gap-1">
                View Documentation <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-10 -mt-10"></div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7"
        >
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Score Breakdown Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(result).map(([key, value]) => {
                    if (key === 'dominant_emotion' || key === 'error') return null;
                    const config = EMOTION_CONFIG[key];
                    const isDominant = key === dominant;
                    
                    return (
                      <div 
                        key={key}
                        className={`p-4 rounded-2xl border transition-all ${
                          isDominant 
                          ? 'bg-white border-blue-500 ring-2 ring-blue-500/10 shadow-md transform scale-[1.02]' 
                          : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${config.color}20` }}>
                            {config.icon}
                          </div>
                          {isDominant && (
                            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              Dominant
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-slate-800">
                          {(Number(value) * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm font-medium text-slate-500 capitalize">{key}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Dashboard Chart Container */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-blue-500" />
                      Emotional Landscape
                    </h3>
                  </div>

                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        />
                        <YAxis hide />
                        <RechartsTooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShade: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-50 rounded-full">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 capitalize">
                          Analysis Complete: {dominant} Detected
                        </h4>
                        <p className="text-sm text-slate-500">
                          This feedback reflects strong {dominant} traits. System suggests personalized engagement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border-2 border-dashed border-slate-200 rounded-3xl"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Analysis Running</h3>
                <p className="text-slate-500 max-w-sm">
                  Input customer feedback on the left to see advanced emotional correlations and metrics in real-time.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
      
      {/* Footer Branding */}
      <div className="mt-20 text-slate-400 text-sm flex items-center gap-1">
        <span>Powered by</span>
        <Brain className="w-4 h-4" />
        <span className="font-bold tracking-tight text-slate-600">CognitiveStream v2.0</span>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  AlertTriangle, 
  X, 
  ExternalLink, 
  Key, 
  Cpu, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { 
  getActiveAIConfig, 
  saveAIConfig, 
  testAIConnection, 
  AIConfig, 
  AIProvider 
} from '../services/realAIService';

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: () => void;
}

export const AIConfigModal: React.FC<AIConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [config, setConfig] = useState<AIConfig>(() => getActiveAIConfig());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showKey, setShowKey] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getActiveAIConfig());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (provider: AIProvider) => {
    let model = 'gemini-flash-lite-latest';
    if (provider === 'groq') model = 'llama-3.3-70b-versatile';
    if (provider === 'openai') model = 'gpt-4o-mini';

    setConfig(prev => ({
      ...prev,
      provider,
      model
    }));
    setTestResult(null);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testAIConnection(config);
      setTestResult(res);
      if (res.success) {
        saveAIConfig(config);
        if (onConfigSaved) onConfigSaved();
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Connection test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    saveAIConfig(config);
    if (onConfigSaved) onConfigSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-[#15161C] border-2 border-emerald-500/30 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222430]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Real AI LLM Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect live LLM APIs to answer anything and evaluate assignments.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222430] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Provider Selector */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Select Real AI Provider:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'gemini', name: 'Google Gemini', sub: 'Recommended Free', freeUrl: 'https://aistudio.google.com/apikey' },
              { id: 'groq', name: 'Groq Cloud', sub: 'Ultra-Fast Free', freeUrl: 'https://console.groq.com/keys' },
              { id: 'openai', name: 'OpenAI GPT', sub: 'GPT-4o Mini', freeUrl: 'https://platform.openai.com/api-keys' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderChange(p.id as AIProvider)}
                className={`p-3 rounded-2xl text-left transition-all border ${
                  config.provider === p.id
                    ? 'bg-emerald-500/15 border-emerald-600 text-emerald-950 dark:text-emerald-200 font-bold shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#0B0B0F] dark:hover:bg-[#1A1D27] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#222430]'
                }`}
              >
                <div className="text-xs font-black">{p.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-500" />
              <span>{config.provider.toUpperCase()} API Key</span>
            </label>
            <a
              href={
                config.provider === 'gemini' 
                  ? 'https://aistudio.google.com/apikey' 
                  : config.provider === 'groq' 
                  ? 'https://console.groq.com/keys' 
                  : 'https://platform.openai.com/api-keys'
              }
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => {
                setConfig({ ...config, apiKey: e.target.value });
                setTestResult(null);
              }}
              placeholder={config.provider === 'gemini' ? 'AIzaSy...' : 'sk-... or gsk_...'}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Model ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
            <span>Active Model Name</span>
          </label>
          <input
            type="text"
            value={config.model}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-xs font-mono text-slate-900 dark:text-white"
          />
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">{testResult.message}</div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#222430]">
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting || !config.apiKey.trim()}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0B0B0F] dark:hover:bg-[#1A1D27] text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 transition-all border border-slate-200 dark:border-[#222430] disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Test Live Connection</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

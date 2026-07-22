import React, { useState } from 'react';
import { 
  User, 
  Sun, 
  Moon, 
  Monitor, 
  ShieldCheck, 
  Key, 
  Bell, 
  Lock, 
  Trash2, 
  Check, 
  Eye, 
  EyeOff,
  Smartphone,
  Laptop,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile | null;
  onUpdateUser: (updatedFields: Partial<UserProfile>) => void;
}

export default function SettingsView({ user, onUpdateUser }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'security' | 'developer' | 'notifications' | 'privacy' | 'danger'>('general');

  // General Settings
  const [name, setName] = useState(user?.name || 'Devanshu Koli');
  const [email, setEmail] = useState(user?.email || 'architect@interviewops.io');

  // Appearance
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>(user?.appearance || 'dark');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);

  // Developer API Keys
  const [geminiKey, setGeminiKey] = useState(user?.apiKeys?.gemini || '');
  const [openaiKey, setOpenaiKey] = useState(user?.apiKeys?.openai || '');
  const [anthropicKey, setAnthropicKey] = useState(user?.apiKeys?.anthropic || '');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // Notifications
  const [emailSummaries, setEmailSummaries] = useState(user?.notifications?.emailSummaries ?? true);
  const [practiceReminders, setPracticeReminders] = useState(user?.notifications?.practiceReminders ?? true);
  const [productUpdates, setProductUpdates] = useState(user?.notifications?.productUpdates ?? false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateUser({
        name,
        email,
        appearance,
        twoFactorEnabled,
        apiKeys: {
          gemini: geminiKey,
          openai: openaiKey,
          anthropic: anthropicKey
        },
        notifications: {
          emailSummaries,
          practiceReminders,
          productUpdates
        }
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight">Account & Platform Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">Configure user profile, security preferences, and developer API keys.</p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-green-950/80 border border-green-800 rounded-xl text-xs font-mono text-green-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Settings Navigation Menu */}
        <div className="space-y-1">
          {[
            { id: 'general', label: 'General', icon: User },
            { id: 'appearance', label: 'Appearance', icon: Moon },
            { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
            { id: 'developer', label: 'Developer API Keys', icon: Key },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy & Data', icon: Lock },
            { id: 'danger', label: 'Delete Account', icon: Trash2 }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.id === 'danger' ? 'text-red-400' : 'text-zinc-400'}`} />
                <span className={item.id === 'danger' ? 'text-red-400' : ''}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Form Body (3 cols) */}
        <div className="md:col-span-3 border border-zinc-800 bg-[#0c0c0e] rounded-xl p-6 space-y-6">
          
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* 1. GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800/80 pb-2">General Profile</h2>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* 2. APPEARANCE */}
            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800/80 pb-2">Appearance Settings</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: 'Dark Mode', icon: Moon },
                    { id: 'light', label: 'Light Mode', icon: Sun },
                    { id: 'system', label: 'System Sync', icon: Monitor }
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAppearance(item.id as any)}
                        className={`p-4 rounded-xl border text-xs flex flex-col items-center gap-2 cursor-pointer transition-all ${
                          appearance === item.id
                            ? 'border-white bg-zinc-800 text-white font-bold'
                            : 'border-zinc-800 bg-[#09090b] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800/80 pb-2">Security & Authentication</h2>

                {/* Password change */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-zinc-300 block">Change Password</span>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* 2FA Toggle */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-zinc-400">Add an extra layer of security using an authenticator app.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer relative ${
                      twoFactorEnabled ? 'bg-green-600' : 'bg-zinc-800'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>

                {/* Active Sessions */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                  <span className="text-xs font-bold text-white block">Active Logged-In Sessions</span>
                  <div className="p-3 bg-[#09090b] border border-zinc-800 rounded-lg flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-zinc-400" />
                      <div>
                        <span className="text-zinc-200 block">Chrome / macOS (Current Session)</span>
                        <span className="text-[10px] text-zinc-500">Active now • IP 127.0.0.1</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-green-950 border border-green-800 text-green-400 px-2 py-0.5 rounded">ACTIVE</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DEVELOPER API KEYS */}
            {activeTab === 'developer' && (
              <div className="space-y-5">
                <div className="border-b border-zinc-800/80 pb-2">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Bring Your Own API Key</h2>
                  <p className="text-xs text-zinc-400 mt-1">Configure your personal keys to route AI interview questions directly through your preferred LLM providers.</p>
                </div>

                {/* Gemini Key */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-zinc-300">Gemini API Key</label>
                    <button type="button" onClick={() => toggleShowKey('gemini')} className="text-zinc-500 hover:text-white">
                      {showKeys['gemini'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <input
                    type={showKeys['gemini'] ? 'text' : 'password'}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* OpenAI Key */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-zinc-300">OpenAI API Key</label>
                    <button type="button" onClick={() => toggleShowKey('openai')} className="text-zinc-500 hover:text-white">
                      {showKeys['openai'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <input
                    type={showKeys['openai'] ? 'text' : 'password'}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Anthropic Key */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-zinc-300">Anthropic Claude Key</label>
                    <button type="button" onClick={() => toggleShowKey('anthropic')} className="text-zinc-500 hover:text-white">
                      {showKeys['anthropic'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <input
                    type={showKeys['anthropic'] ? 'text' : 'password'}
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* 5. NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="border-b border-zinc-800/80 pb-2">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Notification Preferences</h2>
                  <p className="text-xs text-zinc-400 mt-1">Manage how and when InterviewOps communicates updates and practice reminders to you.</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 'emailSummaries',
                      title: 'Weekly Email Summaries',
                      description: 'Receive weekly performance digests and overall topic breakdown reports.',
                      checked: emailSummaries,
                      onChange: () => setEmailSummaries(!emailSummaries)
                    },
                    {
                      id: 'practiceReminders',
                      title: 'Practice Interview Reminders',
                      description: 'Get automated email notifications to keep your streak and practice schedule on track.',
                      checked: practiceReminders,
                      onChange: () => setPracticeReminders(!practiceReminders)
                    },
                    {
                      id: 'productUpdates',
                      title: 'Product & AI Model Updates',
                      description: 'Stay updated when new interview simulation models or system feature releases launch.',
                      checked: productUpdates,
                      onChange: () => setProductUpdates(!productUpdates)
                    }
                  ].map((item) => (
                    <div 
                      key={item.id} 
                      onClick={item.onChange}
                      className="p-4 rounded-xl border border-zinc-800/80 bg-[#09090b] hover:border-zinc-700/80 transition-all cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">{item.title}</span>
                        <p className="text-[11px] text-zinc-400 leading-normal">{item.description}</p>
                      </div>

                      {/* Modern Toggle Slider */}
                      <button
                        type="button"
                        aria-label={`Toggle ${item.title}`}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out p-1 shrink-0 cursor-pointer relative border ${
                          item.checked 
                            ? 'bg-blue-600 border-blue-500/50 shadow-sm shadow-blue-500/20' 
                            : 'bg-zinc-800/80 border-zinc-700/50'
                        }`}
                      >
                        <div 
                          className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                            item.checked ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PRIVACY */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800/80 pb-2">Privacy & Data Control</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your uploaded resumes and session evaluations are private to your account space.
                </p>
                <button
                  type="button"
                  onClick={() => alert('Search and session cache cleared.')}
                  className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 px-4 py-2 rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  Clear Local Practice Cache
                </button>
              </div>
            )}

            {/* 7. DANGER ZONE / DELETE ACCOUNT */}
            {activeTab === 'danger' && (
              <div className="space-y-4 border border-red-900/60 bg-red-950/10 p-5 rounded-xl">
                <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider">Danger Zone</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Permanently delete your InterviewOps account, saved resume library, and interview session history. This action cannot be undone.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to permanently delete your account and all associated data?')) {
                      alert('Account deletion request queued.');
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Delete Account & Data
                </button>
              </div>
            )}

            {/* Save CTA for non-danger tabs */}
            {activeTab !== 'danger' && (
              <div className="pt-4 border-t border-zinc-800/80 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            )}

          </form>

        </div>

      </div>

    </div>
  );
}

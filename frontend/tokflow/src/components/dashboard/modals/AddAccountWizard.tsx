import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Key, QrCode,
  Check, Smartphone, Loader2, AlertCircle, Download,
  Globe, User, CheckCircle, RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { SiTiktok, SiThreads, SiYoutube } from 'react-icons/si';

interface AddAccountWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (username: string, sessionJson: string, platform: string, country: string) => Promise<boolean>;
}

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  borderColor: string;
  available: boolean;
}

export const AddAccountWizard: React.FC<AddAccountWizardProps> = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [country, setCountry] = useState('us');
  const [method, setMethod] = useState<'session' | 'qrcode' | null>(null);
  const [username, setUsername] = useState('');
  const [sessionJson, setSessionJson] = useState('');
  const [error, setError] = useState('');
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);

  const platforms: Platform[] = [
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      description: 'Short videos & automation', 
      icon: <SiTiktok className="w-8 h-8" />,
      iconColor: 'text-[#000000]',
      borderColor: 'border-[#000000]',
      available: true
    },
    { 
      id: 'threads', 
      name: 'Threads', 
      description: 'Text conversations', 
      icon: <SiThreads className="w-8 h-8" />,
      iconColor: 'text-[#000000]',
      borderColor: 'border-[#000000]',
      available: false
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      description: 'YouTube Shorts & content', 
      icon: <SiYoutube className="w-8 h-8" />,
      iconColor: 'text-[#FF0000]',
      borderColor: 'border-[#FF0000]',
      available: false
    },
  ];

  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'uk', name: 'United Kingdom' },
    { code: 'ca', name: 'Canada' },
  ];

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  const handleNext = () => {
    if (step === 1 && !selectedPlatform) {
      setError('Please select a platform');
      return;
    }
    if (step === 2 && !country) {
      setError('Please select a country');
      return;
    }
    if (step === 3 && !method) {
      setError('Please choose a login method');
      return;
    }
    if (step === 3 && method === 'session' && !sessionJson.trim()) {
      setError('Please paste your session');
      return;
    }
    setError('');
    if (step < 4) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4);
      setError('');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false); // Add this state

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (method === 'session') {
      try {
        JSON.parse(sessionJson);
      } catch {
        setError('Invalid JSON format');
        return;
      }
    }
    
    setIsSubmitting(true);
    const success = await onAdd(username, sessionJson, selectedPlatform, country);
    setIsSubmitting(false);
    
    if (success) {
      resetWizard();
    }
  };

  const handleConnectQR = () => {
    setIsConnecting(true);
    setQrExpired(false);
    setTimeout(() => {
      setIsConnecting(false);
      setUsername(`@${selectedPlatform}_user`);
      setTimeout(() => setQrExpired(true), 30000);
    }, 2000);
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedPlatform('');
    setCountry('us');
    setMethod(null);
    setUsername('');
    setSessionJson('');
    setError('');
    setQrCodeGenerated(false);
    setIsConnecting(false);
    setQrExpired(false);
    onClose();
  };

  const progressSteps = [
    { id: 1, label: 'Platform' },
    { id: 2, label: 'Location' },
    { id: 3, label: 'Login' },
    { id: 4, label: 'Account' },
  ];

  if (!isOpen) return null;

  const canContinue = () => {
    if (step === 1) return selectedPlatform !== '';
    if (step === 2) return country !== '';
    if (step === 3) {
      if (method === 'session') return sessionJson.trim() !== '';
      if (method === 'qrcode') return true;
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Back button - goes one step back */}
      <button
        onClick={handleBack}
        className={`fixed top-6 left-6 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10 flex items-center gap-2 ${
          step === 1 ? 'opacity-0 pointer-events-none' : ''
        }`}
      >
        <ArrowLeft className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-500">Back</span>
      </button>

      <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Social Account</h1>
            <p className="text-sm text-gray-500 mt-0.5">Connect a new account to Tokflow</p>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 flex items-center gap-4 max-w-3xl">
            {progressSteps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-300 ${
                    step >= s.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    step >= s.id ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-colors duration-300 ${
                    step > s.id ? 'bg-gray-900' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {/* Step 1: Choose Platform */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 max-w-3xl"
              >
                <h2 className="text-lg font-semibold text-gray-900">Choose platform</h2>
                <div className="grid grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => {
                        if (!platform.available) return;
                        setSelectedPlatform(platform.id);
                        setError('');
                      }}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left relative ${
                        !platform.available
                          ? 'border-gray-200 bg-gray-50 cursor-default'
                          : selectedPlatform === platform.id
                          ? `${platform.borderColor} bg-gray-50 shadow-sm`
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={!platform.available ? 'opacity-40' : ''}>
                        <div className={`mb-3 ${
                          selectedPlatform === platform.id 
                            ? platform.iconColor 
                            : 'text-gray-400'
                        }`}>
                          {platform.icon}
                        </div>
                        <div className="font-semibold text-gray-900">{platform.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{platform.description}</div>
                        {!platform.available && (
                          <span className="inline-block mt-3 px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                            Coming soon
                          </span>
                        )}
                        {selectedPlatform === platform.id && platform.available && (
                          <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-900">
                            <Check className="w-4 h-4" />
                            <span>Selected</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose Location */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 max-w-2xl"
              >
                <h2 className="text-lg font-semibold text-gray-900">Choose location</h2>
                <p className="text-sm text-gray-500">Select where this account will operate from.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        Country
                      </div>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {countries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCountry(c.code);
                            setError('');
                          }}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                            country === c.code
                              ? 'border-gray-900 bg-gray-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{c.name}</div>
                          {country === c.code && (
                            <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-gray-900">
                              <Check className="w-4 h-4" />
                              <span>Selected</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      This determines the region for your account's activity.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Choose Login Method */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 max-w-3xl"
              >
                <h2 className="text-lg font-semibold text-gray-900">Choose login method</h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Session Method */}
                  <button
                    onClick={() => {
                      setMethod('session');
                      setError('');
                    }}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      method === 'session'
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Key className="w-8 h-8 text-gray-700 mb-3" />
                    <div className="font-semibold text-gray-900">Session</div>
                    <div className="text-sm text-gray-500 mt-1">Paste your session JSON.</div>
                    <div className="mt-3 space-y-1">
                      <div className="text-sm text-gray-400">• One click export</div>
                      <div className="text-sm text-gray-400">• Reliable sessions</div>
                      <div className="text-sm text-gray-400">• Easier reconnects</div>
                    </div>
                    {method === 'session' && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900 text-white text-xs rounded-full">
                        <Check className="w-3.5 h-3.5" />
                        Recommended
                      </div>
                    )}
                  </button>

                  {/* QR Method */}
                  <button
                    onClick={() => {
                      setMethod('qrcode');
                      setError('');
                      if (!qrCodeGenerated) {
                        setQrCodeGenerated(true);
                      }
                    }}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      method === 'qrcode'
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <QrCode className="w-8 h-8 text-gray-700 mb-3" />
                    <div className="font-semibold text-gray-900">QR Code</div>
                    <div className="text-sm text-gray-500 mt-1">Scan using your phone.</div>
                    <div className="mt-3 space-y-1">
                      <div className="text-sm text-gray-400">• No browser extension</div>
                      <div className="text-sm text-gray-400">• Quick mobile login</div>
                      <div className="text-sm text-gray-400">• Great for one-time setups</div>
                    </div>
                  </button>
                </div>

                {/* Session Input - shown BEFORE extension prompt */}
                {method === 'session' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Session JSON
                      </label>
                      <textarea
                        value={sessionJson}
                        onChange={(e) => {
                          setSessionJson(e.target.value);
                          setError('');
                        }}
                        placeholder='{"session_id": "...", "csrf_token": "..."}'
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all font-mono text-sm"
                      />
                      <div className="flex items-center gap-2 mt-1.5">
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Your session is encrypted before being stored.</span>
                      </div>
                    </div>

                    {/* Extension prompt - shown AFTER session input */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-200 rounded-lg">
                          <Download className="w-4 h-4 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Don't have a session?</p>
                          <p className="text-sm text-gray-500 mt-0.5">Install our Chrome Extension to export your login session with one click.</p>
                          <a
                            href="#"
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download Extension
                          </a>
                          <span className="text-xs text-gray-400 ml-3">Opens Chrome Store</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* QR Code Content */}
                {method === 'qrcode' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="flex gap-8 items-center">
                      <div className="flex-shrink-0">
                        <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border-2 border-gray-200">
                          {qrCodeGenerated && !qrExpired ? (
                            <div className="w-36 h-36 bg-white rounded-lg flex items-center justify-center">
                              <div className="grid grid-cols-8 gap-0.5">
                                {Array.from({ length: 64 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-3.5 h-3.5 rounded-sm ${
                                      Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : qrExpired ? (
                            <div className="text-center">
                              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                              <p className="text-sm text-gray-500">QR expired</p>
                              <button
                                onClick={handleConnectQR}
                                className="mt-3 text-sm text-gray-700 hover:text-gray-900 flex items-center gap-1.5 mx-auto"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Generate New QR
                              </button>
                            </div>
                          ) : (
                            <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">1</span>
                            <span>Open {selectedPlatformData?.name} app on your phone</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">2</span>
                            <span>Go to Settings → Scan QR Code</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">3</span>
                            <span>Confirm the connection</span>
                          </div>
                        </div>
                        {!qrExpired && (
                          <button
                            onClick={handleConnectQR}
                            disabled={isConnecting}
                            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                          >
                            {isConnecting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                                Connecting...
                              </>
                            ) : (
                              'Connect with QR Code'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 4: Account Details */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 max-w-2xl"
              >
                <h2 className="text-lg font-semibold text-gray-900">Account details</h2>
                <p className="text-sm text-gray-500">Enter your account username.</p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        Username
                      </div>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@youraccount"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-6 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-lg max-w-2xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex-1">
            {step === 1 && (
              <p className="text-sm text-gray-400">Select a platform to continue</p>
            )}
            {step === 2 && (
              <p className="text-sm text-gray-400">Choose the country for this account</p>
            )}
            {step === 3 && (
              <p className="text-sm text-gray-400">Choose your login method</p>
            )}
            {step === 4 && (
              <p className="text-sm text-gray-400">Enter your account username</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetWizard}
              className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canContinue() || isSubmitting}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  canContinue()
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Add Account
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

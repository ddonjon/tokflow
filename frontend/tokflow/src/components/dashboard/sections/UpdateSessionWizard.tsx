import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Account } from '../../types';

interface UpdateSessionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  onUpdate: (accountId: string, sessionJson: string, osProfile: string) => Promise<boolean>;
}

// Automatically detect user's OS so Camoufox perfectly matches their original environment
const detectOS = (): string => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "macos";
  if (ua.includes("linux")) return "linux";
  return "windows"; 
};

export const UpdateSessionWizard: React.FC<UpdateSessionWizardProps> = ({ 
  isOpen, 
  onClose, 
  account, 
  onUpdate 
}) => {
  const [sessionJson, setSessionJson] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !account) return null;

  const handleSubmit = async () => {
    if (!sessionJson.trim()) {
      setError('Please paste your session JSON.');
      return;
    }
    
    try {
      JSON.parse(sessionJson);
    } catch {
      setError('Invalid JSON format. Please ensure you copied the entire array.');
      return;
    }
    
    setIsSubmitting(true);
    const osProfile = detectOS();
    
    // Pass the osProfile upwards so it can be sent to the API
    const success = await onUpdate(account.id, sessionJson, osProfile);
    setIsSubmitting(false);
    
    if (success) {
      setSessionJson('');
      setError('');
      onClose();
    } else {
      setError('Failed to update session. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <button
        onClick={onClose}
        className="fixed top-6 left-6 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-500">Back</span>
      </button>

      <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Update Session</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Refresh the connection for <span className="font-semibold text-gray-700">{account.username}</span>
          </p>
        </div>

        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl"
          >
            <div className="p-6 rounded-xl border-2 border-gray-900 bg-gray-50 shadow-sm text-left">
              <Key className="w-8 h-8 text-gray-700 mb-3" />
              <div className="font-semibold text-gray-900">Session Data</div>
              <div className="text-sm text-gray-500 mt-1">Paste your session JSON below to restore access.</div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <textarea
                    value={sessionJson}
                    onChange={(e) => {
                      setSessionJson(e.target.value);
                      setError('');
                    }}
                    placeholder='[{"domain": ".tiktok.com", "name": "sessionid", "value": "..."}]'
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all font-mono text-sm"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Your session is encrypted before being stored.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-lg max-w-2xl"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400">Paste your updated session array to continue</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !sessionJson.trim()}
              className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Session
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Settings, LogOut, ChevronDown, Plus, 
  Menu, ChevronLeft, FolderOpen, MoreVertical, Trash2,
  RefreshCw, CheckCircle2, XCircle, Loader2
} from 'lucide-react';
import { Account } from '../types';
import { UpdateSessionWizard } from './UpdateSessionWizard';

interface SidebarProps {
  accounts: Account[];
  selectedAccountId: string;
  selectedPlatform: 'tiktok' | 'threads' | 'youtube';
  isSidebarOpen: boolean;
  activeView: 'dashboard' | 'vault';
  onSelectAccount: (id: string) => void;
  onSelectPlatform: (platform: 'tiktok' | 'threads' | 'youtube') => void;
  onToggleSidebar: () => void;
  onAddAccount: () => void;
  onViewChange: (view: 'dashboard' | 'vault') => void;
  onDeleteAccount: (account: Account) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  accounts,
  selectedAccountId,
  selectedPlatform,
  isSidebarOpen,
  activeView,
  onSelectAccount,
  onSelectPlatform,
  onToggleSidebar,
  onAddAccount,
  onViewChange,
  onDeleteAccount,
}) => {
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState<string | null>(null);
  
  const [toast, setToast] = useState<{ message: string, type: 'loading' | 'success' | 'error' } | null>(null);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [accountToUpdate, setAccountToUpdate] = useState<Account | null>(null);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' as const },
    { icon: FolderOpen, label: 'Vault', view: 'vault' as const },
    { icon: Settings, label: 'Settings', view: null },
  ];

  const platformLabels = {
    tiktok: 'TikTok',
    threads: 'Threads',
    youtube: 'YouTube',
  };

  const filteredAccounts = accounts.filter(a => a.platform === selectedPlatform);

  const handleOpenUpdateModal = (account: Account) => {
    setAccountDropdownOpen(null); 
    setAccountToUpdate(account);
    setUpdateModalOpen(true);
  };

  // The submit function now automatically appends the OS footprint
  const submitCookieUpdate = async (accountId: string, newSessionJson: string, osProfile: string): Promise<boolean> => {
    setToast({ message: "Updating session...", type: 'loading' });
    const formData = new FormData();
    formData.append("session_cookie", newSessionJson);
    formData.append("os_profile", osProfile); 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/accounts/${accountId}/cookie`, {
        method: "PUT",
        body: formData,
      });
      
      const data = await response.json();
      if (data.status === "success") {
        setToast({ message: "Session updated successfully!", type: 'success' });
        return true; 
      }
      
      setToast({ message: "Failed to update.", type: 'error' });
      return false;
    } catch (error) {
      console.error(error);
      setToast({ message: "Network error.", type: 'error' });
      return false;
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 64 }}
        className="bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full overflow-hidden transition-all duration-300 relative"
        onClick={() => setAccountDropdownOpen(null)}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 h-14">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              TF
            </div>
            <motion.span
              initial={false}
              animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
              className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
            >
              Tokflow
            </motion.span>
          </div>
          <button onClick={onToggleSidebar} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4 text-gray-500" /> : <Menu className="w-4 h-4 text-gray-500" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-3 border-b border-gray-100 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view || (item.view === null && false);
            return (
              <button
                key={item.label}
                onClick={() => item.view && onViewChange(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <motion.span
                  initial={false}
                  animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              </button>
            );
          })}
        </nav>

        {/* Platform Switcher & Accounts */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-2 py-2">
            {isSidebarOpen ? (
              <div className="relative mb-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsPlatformDropdownOpen(!isPlatformDropdownOpen); }}
                  className="flex items-center justify-between gap-1 px-2.5 py-1 bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200/50 rounded-full transition-all duration-200 text-xs w-auto min-w-[60px]"
                >
                  <span className="font-medium text-gray-700">{platformLabels[selectedPlatform]}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isPlatformDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isPlatformDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10 min-w-[100px]"
                    >
                      {(['tiktok', 'threads', 'youtube'] as const).map((platform) => (
                        <button
                          key={platform}
                          onClick={() => {
                            onSelectPlatform(platform);
                            setIsPlatformDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors ${
                            selectedPlatform === platform ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {platformLabels[platform]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => {
                  const platforms: ('tiktok' | 'threads' | 'youtube')[] = ['tiktok', 'threads', 'youtube'];
                  const currentIndex = platforms.indexOf(selectedPlatform);
                  const nextIndex = (currentIndex + 1) % platforms.length;
                  onSelectPlatform(platforms[nextIndex]);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-[10px] mx-auto transition-colors"
              >
                {selectedPlatform === 'tiktok' ? 'TT' : selectedPlatform === 'threads' ? 'TH' : 'YT'}
              </button>
            )}

            {/* Accounts List */}
            {isSidebarOpen && (
              <div className="px-2 py-1.5">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Accounts</span>
              </div>
            )}
            <div className="space-y-0.5">
              {filteredAccounts.map((account) => (
                <div 
                  key={account.id} 
                  className={`w-full flex items-center pr-1.5 rounded-lg transition-all duration-200 ${
                    selectedAccountId === account.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <button
                    onClick={() => onSelectAccount(account.id)}
                    className="flex-1 flex items-center gap-2.5 px-2 py-1.5 overflow-hidden"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      {account.avatar && <img src={account.avatar} alt={account.username} className="w-full h-full object-cover" />}
                    </div>
                    
                    <motion.div
                      initial={false}
                      animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                      className="flex items-center overflow-hidden"
                    >
                      <span className={`text-sm font-medium truncate whitespace-nowrap ${
                        selectedAccountId === account.id ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {account.username}
                      </span>
                    </motion.div>
                  </button>

                  {isSidebarOpen && (
                    <div className="relative flex-shrink-0">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setAccountDropdownOpen(accountDropdownOpen === account.id ? null : account.id); 
                        }}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      <AnimatePresence>
                        {accountDropdownOpen === account.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20"
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenUpdateModal(account); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Update Session
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); onDeleteAccount(account); setAccountDropdownOpen(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredAccounts.length === 0 && (
                <div className="px-2 mt-2">
                  <button
                    onClick={onAddAccount}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-500" />
                    Add Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User & Logout */}
        <div className="border-t border-gray-100 p-2">
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors group">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              JD
            </div>
            <motion.div
              initial={false}
              animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
              className="flex items-center justify-between flex-1 overflow-hidden"
            >
              <span className="text-sm font-medium whitespace-nowrap">John Doe</span>
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </motion.div>
            {!isSidebarOpen && <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />}
          </button>
        </div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-xl"
          >
            {toast.type === 'loading' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
            <span className="text-sm font-medium text-gray-800">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard Overlay */}
      <UpdateSessionWizard 
        isOpen={updateModalOpen} 
        onClose={() => setUpdateModalOpen(false)}
        account={accountToUpdate}
        onUpdate={submitCookieUpdate}
      />
    </>
  );
};
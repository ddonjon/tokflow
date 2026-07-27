import React, { useState, useEffect } from 'react';
import { Bell, Users, Plus, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Sidebar, SchedulePost, ScheduledView, HistoryView, Vault } from './sections';
import { AddAccountWizard, EditPostModal } from './modals';
import { Account, ScheduledPost } from './types';
import { motion, AnimatePresence } from 'framer-motion';

// Pull the API URL from Netlify environment variables, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<'tiktok' | 'threads' | 'youtube'>('tiktok');
  const [activeView, setActiveView] = useState<'dashboard' | 'vault'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [historyPosts, setHistoryPosts] = useState<ScheduledPost[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const showToast = (message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Accounts
        const accRes = await fetch(`${API_URL}/api/v1/accounts`);
        const accJson = await accRes.json();
        
        if (accJson.status === 'success' && accJson.data) {
          const loadedAccounts: Account[] = accJson.data.map((dbAccount: any) => ({
            id: dbAccount.id,
            username: dbAccount.account_username,
            sessionCookie: JSON.stringify(dbAccount.session_cookies),
            platform: 'tiktok',
          }));
          
          setAccounts(loadedAccounts);
          if (loadedAccounts.length > 0) setSelectedAccountId(loadedAccounts[0].id);
        }

        // Fetch Posts
        const postRes = await fetch(`${API_URL}/api/v1/posts`);
        const postJson = await postRes.json();

        if (postJson.status === 'success' && postJson.data) {
          const loadedPosts: ScheduledPost[] = postJson.data.map((dbPost: any) => ({
            id: dbPost.id,
            accountId: dbPost.account_id,
            videoName: dbPost.video_name,
            caption: dbPost.caption,
            scheduledFor: new Date(dbPost.scheduled_for || new Date()),
            status: dbPost.status
          }));

          setScheduledPosts(loadedPosts.filter(p => p.status === 'scheduled'));
          setHistoryPosts(loadedPosts.filter(p => p.status !== 'scheduled'));
        }
      } catch (error) {
        showToast('Failed to fetch data from server.', 'error');
      }
    };
    fetchData();
  }, []);

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;
    
    try {
      const response = await fetch(`${API_URL}/api/v1/accounts/${accountToDelete.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setAccounts(prev => prev.filter(a => a.id !== accountToDelete.id));
        if (selectedAccountId === accountToDelete.id) {
          setSelectedAccountId(accounts.find(a => a.id !== accountToDelete.id)?.id || '');
        }
        showToast(`${accountToDelete.username} deleted successfully.`, 'success');
      } else {
        showToast('Failed to delete account.', 'error');
      }
    } catch (error) {
      showToast('Network error while deleting.', 'error');
    } finally {
      setAccountToDelete(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.dropdown-menu')) {
          setDropdownOpen(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const filteredAccounts = accounts.filter(a => a.platform === selectedPlatform);
  const selectedAccount = filteredAccounts.find(a => a.id === selectedAccountId);

  useEffect(() => {
    if (filteredAccounts.length > 0 && !filteredAccounts.find(a => a.id === selectedAccountId)) {
      setSelectedAccountId(filteredAccounts[0].id);
    }
  }, [selectedPlatform, filteredAccounts, selectedAccountId]);

  const accountScheduledPosts = scheduledPosts.filter(p => p.accountId === selectedAccountId);
  const sortedHistoryPosts = [...historyPosts.filter(p => p.accountId === selectedAccountId)].sort((a, b) => {
    return sortOrder === 'newest' ? b.scheduledFor.getTime() - a.scheduledFor.getTime() : a.scheduledFor.getTime() - b.scheduledFor.getTime();
  });

  const handleAddAccount = async (username: string, sessionJson: string, platform: string, country: string, osProfile: string = "windows"): Promise<boolean> => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('session_cookie', sessionJson);
    formData.append('platform', platform);
    formData.append('country', country);
    formData.append('os_profile', osProfile);

    try {
      const response = await fetch(`${API_URL}/api/v1/accounts/add`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        const newAccount: Account = { 
          id: data.data?.[0]?.id || Date.now().toString(), 
          username, 
          sessionCookie: sessionJson, 
          platform: platform as 'tiktok' | 'threads' | 'youtube',
        };
        
        setAccounts(prev => [...prev, newAccount]);
        setSelectedAccountId(newAccount.id);
        showToast(`Account ${username} connected successfully.`, 'success');
        return true;
      } else {
        showToast(`Failed: ${data.detail || 'Unknown error'}`, 'error');
        return false;
      }
    } catch (error) {
      showToast('Network error while saving account.', 'error');
      return false;
    }
  };

  const handleSchedule = async () => {
    if (!selectedAccount) { showToast('No account selected', 'error'); return; }
    if (!selectedFile) { showToast('Select a video file', 'error'); return; }
    if (!caption.trim()) { showToast('Enter a caption', 'error'); return; }
    if (!selectedAccount.sessionCookie) { showToast('No session cookie found', 'error'); return; }

    setIsScheduling(true);

    try {
      if (scheduledDate) {
        // --- PATH A: SCHEDULED POST (Uploads to Vault First) ---
        showToast('Uploading video to secure vault...', 'info');
        
        const vaultData = new FormData();
        vaultData.append("video", selectedFile);
        
        const vaultRes = await fetch(`${API_URL}/api/v1/vault/upload`, {
          method: "POST",
          body: vaultData
        });
        const vaultResult = await vaultRes.json();
        
        if (vaultResult.status !== "success") {
          showToast('Vault upload failed.', 'error');
          setIsScheduling(false);
          return;
        }

        showToast('Scheduling post...', 'info');
        
        const postData = new FormData();
        postData.append("video_url", vaultResult.url); // Sending the Vault URL
        postData.append("caption", caption);
        postData.append("session_cookie", selectedAccount.sessionCookie);
        postData.append("account_id", selectedAccount.id);
        postData.append("video_name", selectedFile.name);
        postData.append("scheduled_for", new Date(scheduledDate).toISOString());
        
        const response = await fetch(`${API_URL}/api/v1/upload`, { method: "POST", body: postData });
        const data = await response.json();

        if (response.ok && data.status === 'success') {
          const newPost: ScheduledPost = {
            id: data.post_id || Date.now().toString(),
            accountId: selectedAccount.id,
            videoName: selectedFile.name,
            caption,
            scheduledFor: new Date(scheduledDate),
            status: 'scheduled',
          };
          setScheduledPosts(prev => [...prev, newPost]);
          showToast('Post scheduled successfully!', 'success');
          
          setSelectedFile(undefined);
          setCaption('');
          setScheduledDate('');
        } else {
          showToast(`Scheduling failed: ${data.detail || data.message || 'Error'}`, 'error');
        }

      } else {
        // --- PATH B: INSTANT POST (Direct Execution) ---
        showToast(`Initializing upload for ${selectedAccount.username}...`, 'info');
        
        const postData = new FormData();
        postData.append("video", selectedFile); // Sending raw file directly
        postData.append("caption", caption);
        postData.append("session_cookie", selectedAccount.sessionCookie);
        postData.append("account_id", selectedAccount.id);
        postData.append("video_name", selectedFile.name);
        
        const response = await fetch(`${API_URL}/api/v1/upload`, { method: "POST", body: postData });
        const data = await response.json();

        if (response.ok && (data.status === 'success' || data.status === 'failed')) {
          const newPost: ScheduledPost = {
            id: data.post_id || Date.now().toString(),
            accountId: selectedAccount.id,
            videoName: selectedFile.name,
            caption,
            scheduledFor: new Date(),
            status: data.status === 'failed' ? 'failed' : 'posted',
          };
          
          setHistoryPosts(prev => [newPost, ...prev]);
          
          if (data.status === 'failed') {
            showToast('Upload failed. Check history.', 'error');
            if (data.message && data.message.includes('Timeout')) {
              showToast(`Session Expired: Please reconnect ${selectedAccount.username}`, 'error');
            }
          } else {
            showToast('Posted successfully!', 'success');
            setSelectedFile(undefined);
            setCaption('');
          }
        } else {
          showToast(`Upload failed: ${data.detail || data.message || 'Error'}`, 'error');
        }
      }
    } catch (error) {
      showToast('Network error during upload.', 'error');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
    setDropdownOpen(null);
  };

  const handleSaveEdit = async (newCaption: string, newDate: Date) => {
    if (!editingPost) return;

    const formData = new FormData();
    formData.append('caption', newCaption);
    formData.append('scheduled_for', newDate.toISOString());

    try {
      const response = await fetch(`${API_URL}/api/v1/posts/${editingPost.id}`, { 
        method: 'PUT',
        body: formData 
      });
      
      if (response.ok) {
        setScheduledPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, caption: newCaption, scheduledFor: newDate } : p));
        showToast('Post updated successfully!', 'success');
      } else {
        showToast('Failed to update post.', 'error');
      }
    } catch (error) {
      showToast('Network error while updating.', 'error');
    }
  };

  const handleCancelPost = async (postId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/posts/${postId}`, { method: 'DELETE' });
      if (response.ok) {
        setScheduledPosts(prev => prev.filter(p => p.id !== postId));
        showToast('Post cancelled permanently.', 'info');
      } else {
        showToast('Failed to cancel post.', 'error');
      }
    } catch (error) {
      showToast('Network error while cancelling.', 'error');
    }
    setDropdownOpen(null);
  };

  return (
    <div className="absolute inset-0 bg-gray-50 text-gray-900 z-50 overflow-hidden">
      
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
                toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
                toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
                'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {accountToDelete && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-gray-100"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Disconnect Account?</h3>
              
              <p className="text-sm text-gray-500 mb-8 px-2">
                Are you sure you want to remove <span className="font-semibold text-gray-900">{accountToDelete.username}</span>? You will need to re-authenticate to post from it again.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setAccountToDelete(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm shadow-red-600/20"
                >
                  Disconnect
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex h-full">
        <Sidebar
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          selectedPlatform={selectedPlatform}
          isSidebarOpen={isSidebarOpen}
          activeView={activeView}
          onSelectAccount={setSelectedAccountId}
          onSelectPlatform={setSelectedPlatform}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onAddAccount={() => setIsAddModalOpen(true)}
          onViewChange={setActiveView}
          onDeleteAccount={setAccountToDelete}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 h-14">
            <h1 className="text-lg font-semibold text-gray-900">
              {activeView === 'vault' ? 'Vault' : (selectedAccount?.username || 'Workspace')}
            </h1>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden p-4">
            {activeView === 'vault' ? (
              <Vault />
            ) : (
              selectedAccount ? (
                <div className="h-full">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <SchedulePost
                      selectedFile={selectedFile}
                      caption={caption}
                      scheduledDate={scheduledDate}
                      isScheduling={isScheduling}
                      onFileSelect={setSelectedFile}
                      onFileRemove={() => setSelectedFile(undefined)}
                      onCaptionChange={setCaption}
                      onDateChange={setScheduledDate}
                      onSchedule={handleSchedule}
                    />

                    {showHistory ? (
                      <HistoryView
                        posts={sortedHistoryPosts}
                        sortOrder={sortOrder}
                        onSortChange={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                        onBack={() => setShowHistory(false)}
                      />
                    ) : (
                      <ScheduledView
                        posts={accountScheduledPosts}
                        dropdownOpen={dropdownOpen}
                        onDropdownToggle={setDropdownOpen}
                        onEdit={handleEditPost}
                        onCancel={handleCancelPost}
                        onViewHistory={() => setShowHistory(true)}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Connect an account to get started.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center justify-center px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Add Account
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>


      <AddAccountWizard isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddAccount} />
      <EditPostModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveEdit} post={editingPost} />
    </div>
  );
};

export default Dashboard;
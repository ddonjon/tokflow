import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/dashboard/Dashboard';
import Background from './components/Background';
import { AuthContext } from './hooks/useAuth';
import './index.css';

const mockAuth = {
  user: { uid: 'mock-123', email: 'test@example.com' } as any,
  profile: {
    uid: 'mock-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
    plan: 'pro' as const,
    createdAt: new Date(),
  },
  loading: false,
  login: async () => {},
  logout: async () => {},
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthContext.Provider value={mockAuth}>
      <main className="relative min-h-screen selection:bg-primary-blue/30">
        <Background />
        <Dashboard />
      </main>
    </AuthContext.Provider>
  </React.StrictMode>
);

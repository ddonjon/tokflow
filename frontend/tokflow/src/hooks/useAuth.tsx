import React, { useState, createContext, useContext } from 'react';

// Keep your existing interfaces so TypeScript stays happy
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: any;
}

interface AuthContextType {
  user: any; // Relaxed typing here to avoid needing the full Firebase object
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Create a bulletproof mock user
  const mockUser = {
    uid: 'demo-creator-123',
    email: 'founder@ddonroute.com',
    displayName: 'ddonroute Admin',
    photoURL: 'https://ui-avatars.com/api/?name=ddonroute+Admin&background=0D8ABC&color=fff',
  };

  // 2. Create the matching Firestore profile mock
  const mockProfile: UserProfile = {
    uid: mockUser.uid,
    email: mockUser.email,
    displayName: mockUser.displayName,
    photoURL: mockUser.photoURL,
    plan: 'pro', // Set to pro to ensure no premium UI blocks trigger during the demo
    createdAt: new Date(),
  };

  // 3. Bypass loading completely and set state immediately
  const [user] = useState<any>(mockUser);
  const [profile] = useState<UserProfile>(mockProfile);
  const [loading] = useState(false);

  // Dummy functions to prevent crashes if a "Logout" button is clicked
  const login = async () => { console.log('Mock login bypassed'); };
  const logout = async () => { console.log('Mock logout bypassed'); };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
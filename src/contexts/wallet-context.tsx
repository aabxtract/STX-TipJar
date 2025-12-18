'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
const network = new StacksTestnet();

interface WalletContextType {
  isConnected: boolean;
  userAddress: string | null;
  connectWallet: (forSignup?: boolean) => void;
  disconnectWallet: () => void;
  userSession: UserSession;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const isConnected = !!userAddress && !!user;

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.testnet);
    } else {
      setUserAddress(null);
    }
  }, [user]);

  const connectWallet = useCallback((forSignup = false) => {
    showConnect({
      appDetails: {
        name: 'STX TipJar',
        icon: '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserAddress(userData.profile.stxAddress.testnet);
        // If not signing up and not already logged in, sign in anonymously
        if (!forSignup && !auth.currentUser) {
          signInAnonymously(auth);
        }
      },
      userSession,
    });
  }, [auth]);

  const disconnectWallet = () => {
    if (userSession.isUserSignedIn()) {
        userSession.signUserOut('/');
    }
    if (auth.currentUser) {
        auth.signOut();
    }
    setUserAddress(null);
  };

  const value = { isConnected, userAddress, connectWallet, disconnectWallet, userSession };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

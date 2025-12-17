'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
const network = new StacksTestnet();

interface WalletContextType {
  isConnected: boolean;
  userAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  userSession: UserSession;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setIsConnected(true);
      setUserAddress(userData.profile.stxAddress.testnet);
    } else {
        setIsConnected(false);
        setUserAddress(null);
    }
  }, []);

  const connectWallet = useCallback(() => {
    showConnect({
      appDetails: {
        name: 'STX TipJar',
        icon: '/logo.png', // Make sure you have a logo at this path in your public folder
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setIsConnected(true);
        setUserAddress(userData.profile.stxAddress.testnet);
      },
      userSession,
    });
  }, []);

  const disconnectWallet = () => {
    userSession.signUserOut('/');
    setIsConnected(false);
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

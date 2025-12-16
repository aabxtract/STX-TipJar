'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock user data for a connected wallet
const MOCK_USER_ADDRESS = 'SP2J6B0D5N42DJ2D84D9842A1Z57K5X2A4020JT';

interface WalletContextType {
  isConnected: boolean;
  userAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const connectWallet = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setUserAddress(MOCK_USER_ADDRESS);
  };

  const disconnectWallet = () => {
    // Simulate wallet disconnection
    setIsConnected(false);
    setUserAddress(null);
  };

  const value = { isConnected, userAddress, connectWallet, disconnectWallet };

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

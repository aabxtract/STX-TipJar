'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Mock user data for a connected wallet
const MOCK_USER_ADDRESSES = [
    'SP2J6B0D5N42DJ2D84D9842A1Z57K5X2A4020JT',
    'SP3EQC532C034V462B2GN3050C773344V3S9SCW1P',
    'SP1CS4S3SH419827D087X73T0JT02V9A9K8EZQR5',
];
let addressIndex = 0;


interface WalletContextType {
  isConnected: boolean;
  userAddress: string | null;
  connectWallet: (switchWallet?: boolean) => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const connectWallet = useCallback((switchWallet = false) => {
    // Simulate wallet connection
    if (switchWallet) {
        addressIndex = (addressIndex + 1) % MOCK_USER_ADDRESSES.length;
    }
    setIsConnected(true);
    setUserAddress(MOCK_USER_ADDRESSES[addressIndex]);
  }, []);

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

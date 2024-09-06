
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WalletContextType {
  balance: string;
  stakedAmount: string;
  claimableAmount: string;
  loading: boolean;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<string>('0');
  const [stakedAmount, setStakedAmount] = useState<string>('0');
  const [claimableAmount, setClaimableAmount] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const { user, provider } = useAuth();

  const refreshWallet = async () => {
    if (user && provider) {
      setLoading(true);
      try {
        // Implement logic to fetch balance, staked amount, and claimable amount
        // This is a placeholder and should be replaced with actual Web3 calls
        const fetchedBalance = '10'; // Example value
        const fetchedStakedAmount = '5'; // Example value
        const fetchedClaimableAmount = '2'; // Example value
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

        setBalance(fetchedBalance);
        setStakedAmount(fetchedStakedAmount);
        setClaimableAmount(fetchedClaimableAmount);
      } catch (error) {
        console.error('Error refreshing wallet:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    refreshWallet();
  }, [user, provider]);

  return (
    <WalletContext.Provider value={{ balance, stakedAmount, claimableAmount, loading, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

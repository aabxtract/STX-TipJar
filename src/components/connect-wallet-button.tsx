'use client';

import { useWallet } from '@/contexts/wallet-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { truncateAddress } from '@/lib/utils';
import { ChevronDown, Copy, LogOut, Wallet, Replace } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ConnectWalletButton() {
  const { isConnected, userAddress, connectWallet, disconnectWallet } = useWallet();
  const { toast } = useToast();

  const handleCopy = () => {
    if (!userAddress) return;
    navigator.clipboard.writeText(userAddress);
    toast({
      title: 'Address Copied',
      description: 'Your wallet address has been copied to the clipboard.',
    });
  };
  
  const handleSwitchWallet = () => {
    disconnectWallet();
    // A small delay to allow state to update before connecting again
    setTimeout(() => {
        connectWallet(true); // `true` indicates a switch
    }, 100);
  };


  if (isConnected && userAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>{truncateAddress(userAddress)}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Address</span>
          </DropdownMenuItem>
           <DropdownMenuItem onClick={handleSwitchWallet}>
            <Replace className="mr-2 h-4 w-4" />
            <span>Switch Wallet</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnectWallet}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => connectWallet()}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/contexts/wallet-context';
import { getStatsForAddress, getTipsForAddress, type Tip } from '@/lib/stacks';
import { truncateAddress } from '@/lib/utils';
import { RecentTips } from '@/components/recent-tips';
import { StatCard } from '@/components/stat-card';
import { Coins, HandCoins, Clock, Wallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { userAddress, isConnected, connectWallet } = useWallet();
  const [stats, setStats] = useState({ totalTipped: 0, tipCount: 0, latestTip: 'Never' });
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (userAddress) {
        setLoading(true);
        const [userStats, userTips] = await Promise.all([
          getStatsForAddress(userAddress),
          getTipsForAddress(userAddress),
        ]);
        setStats(userStats);
        setTips(userTips);
        setLoading(false);
      }
    }
    fetchData();
  }, [userAddress]);

  if (!isConnected || !userAddress) {
    return (
        <div className="container mx-auto max-w-4xl py-8 px-4 flex flex-col items-center justify-center h-[60vh]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Welcome to Your Dashboard</CardTitle>
                    <CardDescription>Connect your wallet to view your TipJar stats.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={connectWallet}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  const jarUrl = typeof window !== 'undefined' ? `${window.location.origin}/?recipient=${userAddress}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(jarUrl);
    toast({
      title: 'Copied to Clipboard',
      description: 'Your TipJar link has been copied.',
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My TipJar</h1>
            <p className="text-sm text-muted-foreground">Stats for {truncateAddress(userAddress, 8)}</p>
        </div>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">Your Public TipJar Link</p>
            <div className="flex items-center gap-2">
                <input type="text" value={jarUrl} readOnly className="text-sm p-2 rounded-md bg-background border w-full sm:w-auto break-all"/>
                <Button size="sm" onClick={handleCopy}>Copy</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard
          title="Total Tips Received"
          value={`${stats.totalTipped.toLocaleString()} STX`}
          icon={Coins}
        />
        <StatCard
          title="Number of Tips"
          value={stats.tipCount}
          icon={HandCoins}
        />
        <StatCard
          title="Latest Tip"
          value={stats.latestTip}
          icon={Clock}
        />
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Transaction History</h2>
        <RecentTips tips={tips} />
      </div>
    </div>
  );
}

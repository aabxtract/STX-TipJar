'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/contexts/wallet-context';
import { getStatsForAddress, getTipsForAddress, type Tip } from '@/lib/stacks';
import { truncateAddress } from '@/lib/utils';
import { RecentTips } from '@/components/recent-tips';
import { StatCard } from '@/components/stat-card';
import { Coins, HandCoins, Clock, Wallet, Twitter, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { userAddress, isConnected, connectWallet } = useWallet();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [stats, setStats] = useState({ totalTipped: 0, tipCount: 0, latestTip: 'Never' });
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isUserLoading) return; // Wait for user state to be determined
    if (!user) {
      router.push('/login');
      return;
    }
    if (!userAddress) {
      connectWallet();
    }
  }, [user, isUserLoading, userAddress, router, connectWallet]);

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

  const jarUrl = typeof window !== 'undefined' ? `${window.location.origin}/address/${userAddress}` : '';

  const handleCopy = () => {
    if (!jarUrl) return;
    navigator.clipboard.writeText(jarUrl);
    toast({
      title: 'Copied to Clipboard',
      description: 'Your TipJar link has been copied.',
    });
  };

  const shareOnTwitter = () => {
    const text = "Tip me in STX on my TipJar! It's on-chain, public, and easy to do.";
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(jarUrl)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  };
  
  const handleShare = async () => {
    if (!jarUrl) return;
    const shareData = {
      title: 'My STX TipJar',
      text: "Tip me in STX on my TipJar! It's on-chain, public, and easy to do.",
      url: jarUrl,
    };
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };


  if (isUserLoading || !user || !isConnected) {
    return (
        <div className="container mx-auto max-w-4xl py-8 px-4 flex flex-col items-center justify-center h-[60vh]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Loading Dashboard...</CardTitle>
                    <CardDescription>Connecting to your wallet and fetching your data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => connectWallet()}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My TipJar</h1>
            <p className="text-sm text-muted-foreground">Stats for {truncateAddress(userAddress || '')}</p>
        </div>
        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
              <p className="text-sm font-medium">Share Your TipJar</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-2">
                <input type="text" value={jarUrl} readOnly className="text-sm p-2 rounded-md bg-background border w-full sm:w-auto break-all"/>
                <Button size="sm" onClick={handleCopy}>Copy</Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={shareOnTwitter} className="w-full">
                    <Twitter className="mr-2"/>
                    Share on X
                </Button>
                <Button size="sm" variant="outline" onClick={handleShare} className="w-full">
                    <Share2 className="mr-2"/>
                    Share
                </Button>
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

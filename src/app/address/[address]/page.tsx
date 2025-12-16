import { notFound } from 'next/navigation';
import { getStatsForAddress, getTipsForAddress } from '@/lib/stacks';
import { truncateAddress } from '@/lib/utils';
import { RecentTips } from '@/components/recent-tips';
import { StatCard } from '@/components/stat-card';
import { Coins, HandCoins, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AddressPageProps {
  params: {
    address: string;
  };
}

export default async function AddressPage({ params }: AddressPageProps) {
  const { address } = params;

  // Basic validation for STX address format
  if (!/^[SMNPQRS]{1}[0-9A-HJ-NP-Z]{33,39}$/.test(address)) {
    notFound();
  }

  const tips = await getTipsForAddress(address);
  const stats = await getStatsForAddress(address);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col gap-2 mb-8">
        <p className="text-sm text-muted-foreground">Tip Jar For</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight break-all">{truncateAddress(address, 8)}</h1>
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

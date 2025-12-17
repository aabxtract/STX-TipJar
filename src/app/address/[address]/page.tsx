import { notFound } from 'next/navigation';
import { getStatsForAddress, getTipsForAddress } from '@/lib/stacks';
import { truncateAddress } from '@/lib/utils';
import { RecentTips } from '@/components/recent-tips';
import { StatCard } from '@/components/stat-card';
import { Coins, HandCoins, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { TipForm } from '@/components/tip-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="container mx-auto max-w-4xl py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-8">
        <div>
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
        </div>

        <Separator className="my-0" />

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Transaction History</h2>
          <RecentTips tips={tips} />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-24">
            <TipForm recipient={address} />
        </div>
      </div>
    </div>
  );
}

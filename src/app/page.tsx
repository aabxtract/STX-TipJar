import Link from 'next/link';
import { TipForm } from '@/components/tip-form';
import { RecentTips } from '@/components/recent-tips';
import { getRecentTips } from '@/lib/stacks';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default async function Home() {
  const recentTips = await getRecentTips();

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight">Send a Tip</h1>
            <p className="text-muted-foreground">
              Brighten someone&apos;s day with a little STX. All tips are public and on-chain.
            </p>
          </div>
          <TipForm />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Recent Tips</h2>
          <RecentTips tips={recentTips} />
        </div>
      </div>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Create Your Own Tip Jar
        </h2>
        <p className="mt-2 text-muted-foreground">
          Want a unique tip jar like this? It&apos;s easy to set up.
        </p>
        <Button asChild className="mt-4">
          <Link href="#">Sign Up Now</Link>
        </Button>
      </div>
    </div>
  );
}

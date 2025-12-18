import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto max-w-2xl py-16 px-4">
      <div className="flex flex-col items-center gap-8 text-center">
        
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-poppins bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent/80">
            Your Personal STX TipJar
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Create a free, on-chain tip jar in seconds. Connect your wallet, share your link, and start receiving tips in Stacks (STX).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Button asChild size="lg">
            <Link href="/signup">
              <UserPlus />
              Create Your TipJar
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">
                <LogIn />
                Login to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-8 p-6 rounded-lg border bg-card/50 w-full">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ol className="list-decimal list-inside text-left space-y-2 text-sm text-muted-foreground">
                <li>Sign up and connect your Stacks wallet.</li>
                <li>Get a unique, shareable link to your personal TipJar page.</li>
                <li>Share your link on social media, your blog, or anywhere online.</li>
                <li>Receive tips in STX directly to your wallet, publicly and on-chain.</li>
            </ol>
        </div>

      </div>
    </div>
  );
}

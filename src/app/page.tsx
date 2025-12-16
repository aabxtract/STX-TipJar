import Link from 'next/link';
import { TipForm } from '@/components/tip-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default async function Home() {
  return (
    <div className="container mx-auto max-w-xl py-8 px-4">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Send a Tip</h1>
          <p className="text-muted-foreground">
            Brighten someone&apos;s day with a little STX. All tips are public and on-chain.
          </p>
        </div>
        <div className="w-full">
         <TipForm />
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

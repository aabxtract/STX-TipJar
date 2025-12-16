import Link from 'next/link';
import { TipForm } from '@/components/tip-form';
import { Button } from '@/components/ui/button';

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
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Want your own tip jar?{' '}
            <Link href="#" className="underline hover:text-primary">
              Sign up now
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

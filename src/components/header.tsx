import Link from 'next/link';
import BitcoinIcon from './icons/bitcoin-icon';
import { ConnectWalletButton } from './connect-wallet-button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex justify-center p-4">
      <div className="container flex h-14 max-w-4xl items-center rounded-2xl border border-white/20 bg-background/50 p-4 shadow-lg backdrop-blur-lg">
        <div className="flex flex-1 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BitcoinIcon className="h-6 w-6 text-primary" />
            <span className="font-headline font-bold">STX TipJar</span>
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}

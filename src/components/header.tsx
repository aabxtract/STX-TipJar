import Link from 'next/link';
import BitcoinIcon from './icons/bitcoin-icon';
import { ConnectWalletButton } from './connect-wallet-button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BitcoinIcon className="h-6 w-6 text-primary" />
            <span className="font-bold">STX TipJar</span>
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2 mr-[75px]">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}

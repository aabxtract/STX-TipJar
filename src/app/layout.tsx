import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { WalletProvider } from '@/contexts/wallet-context';
import { Header } from '@/components/header';
import { AnimationProvider } from '@/contexts/animation-context';
import { CoinAnimationOverlay } from '@/components/coin-animation-overlay';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'STX TipJar',
  description: 'Send STX tips to any wallet address on Stacks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat+Alternates:wght@700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <WalletProvider>
            <AnimationProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
              <CoinAnimationOverlay />
            </AnimationProvider>
          </WalletProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

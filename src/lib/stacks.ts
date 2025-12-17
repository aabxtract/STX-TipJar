import { formatDistanceToNow } from 'date-fns';

export interface Tip {
  txId: string;
  sender: string;
  recipient: string;
  amount: number;
  timestamp: Date;
  message?: string;
}

// Mock database of tips
const mockTips: Tip[] = [
  {
    txId: '0x1',
    sender: 'SP3EQC532C034V462B2GN3050C773344V3S9SCW1P',
    recipient: 'SP1CS4S3SH419827D087X73T0JT02V9A9K8EZQR5',
    amount: 10,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    message: 'Great work on the project! Your efforts are really showing.',
  },
  {
    txId: '0x2',
    sender: 'SP2J6B0D5N42DJ2D84D9842A1Z57K5X2A4020JT',
    recipient: 'SP1CS4S3SH419827D087X73T0JT02V9A9K8EZQR5',
    amount: 5.5,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    txId: '0x3',
    sender: 'SP3EQC532C034V462B2GN3050C773344V3S9SCW1P',
    recipient: 'SP2J6B0D5N42DJ2D84D9842A1Z57K5X2A4020JT',
    amount: 25,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    message: 'For the coffee! ☕️ Keep up the awesome streams.',
  },
  {
    txId: '0x4',
    sender: 'SP1CS4S3SH419827D087X73T0JT02V9A9K8EZQR5',
    recipient: 'SP3EQC532C034V462B2GN3050C773344V3S9SCW1P',
    amount: 100,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    txId: '0x5',
    sender: 'SP2J6B0D5N42DJ2D84D9842A1Z57K5X2A4020JT',
    recipient: 'SP3EQC532C034V462B2GN3050C773344V3S9SCW1P',
    amount: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    message: 'Welcome to Stacks!',
  },
];

// Simulates sending a tip and adding it to our mock database
export async function sendTip(tip: Omit<Tip, 'txId' | 'timestamp'>): Promise<Tip> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTip: Tip = {
        ...tip,
        txId: `0x${(Math.random() * 1e18).toString(16)}`,
        timestamp: new Date(),
      };
      mockTips.unshift(newTip);
      resolve(newTip);
    }, 1500); // Simulate network delay
  });
}

// Simulates fetching recent tips
export async function getRecentTips(limit: number = 10): Promise<Tip[]> {
  return Promise.resolve(mockTips.slice(0, limit));
}

// Simulates fetching tips for a specific address
export async function getTipsForAddress(address: string): Promise<Tip[]> {
  return Promise.resolve(
    mockTips.filter((tip) => tip.recipient === address || tip.sender === address)
  );
}

// Simulates getting stats for a specific address
export async function getStatsForAddress(address: string) {
  const relevantTips = mockTips.filter((tip) => tip.recipient === address);
  const totalTipped = relevantTips.reduce((sum, tip) => sum + tip.amount, 0);
  const tipCount = relevantTips.length;
  const latestTip = relevantTips.length > 0 ? formatDistanceToNow(relevantTips[0].timestamp, { addSuffix: true }) : 'Never';

  return Promise.resolve({
    totalTipped,
    tipCount,
    latestTip,
  });
}

import { formatDistanceToNow } from 'date-fns';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import {
  callReadOnlyFunction,
  standardPrincipal,
  uintCV,
  stringAsciiCV,
  ClarityValue,
  cvToJSON,
  PostConditionMode,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  createAssetInfo,
} from '@stacks/transactions';
import { userSession } from '@/lib/wallet-context-provider';
import { openContractCall } from '@stacks/connect';

// TODO: Replace with your actual contract details
const CONTRACT_ADDRESS = 'ST3JDRV4QW9SYFSFGT2V1RQ3S1T7CBYG21SF7Y00D';
const CONTRACT_NAME = 'tipjar';

export interface Tip {
  txId: string;
  sender: string;
  recipient: string;
  amount: number;
  timestamp: Date;
  message?: string;
}

// Mock database of tips - we will replace this with real on-chain data later
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
];


export async function sendTip(tip: { recipient: string, amount: number, message?: string }) {
    const { recipient, amount, message } = tip;
    const network = new StacksTestnet();

    const functionArgs = [
        standardPrincipal(recipient),
        uintCV(amount * 1000000), // Convert STX to micro-STX
        message ? stringAsciiCV(message) : stringAsciiCV(''),
    ];

    // Post-condition: Ensure the sender transfers the exact amount of STX
    const postConditions = [
        makeStandardFungiblePostCondition(
            userSession.loadUserData().profile.stxAddress.testnet,
            FungibleConditionCode.Equal,
            uintCV(amount * 1000000).value,
            createAssetInfo(CONTRACT_ADDRESS, 'stx', 'stx')
        ),
    ];
    
    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'send-tip',
        functionArgs,
        network,
        postConditions,
        appDetails: {
            name: 'STX TipJar',
            icon: '/logo.png',
        },
        onFinish: (data: any) => {
            console.log('Transaction finished:', data);
            // Here you can handle success, e.g., show a toast, trigger a refresh
        },
        onCancel: () => {
            console.log('Transaction cancelled.');
            // Handle cancellation
        },
    };

    await openContractCall(options);
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
